from flask import Blueprint, request, jsonify, current_app
from bson.objectid import ObjectId
from datetime import datetime, timezone
from app.models import ScenarioSchema
from dateutil.parser import isoparse

api = Blueprint('api', __name__)

scenario_schema = ScenarioSchema()
scenarios_schema = ScenarioSchema(many=True)


def normalize_dates(data: dict):
    """
    Ensure date fields are proper datetime objects.
    Mutates and returns data safely.
    """
    now = datetime.now(timezone.utc)

    # Top-level timestamps
    for key in ['createdAt', 'updatedAt']:
        if key in data and isinstance(data[key], str):
            try:
                data[key] = isoparse(data[key])
            except Exception:
                data[key] = now

    # Nested dateRange
    if 'dateRange' in data and isinstance(data['dateRange'], dict):
        for subkey in ['start', 'end']:
            value = data['dateRange'].get(subkey)
            if isinstance(value, str):
                try:
                    data['dateRange'][subkey] = isoparse(value)
                except Exception:
                    data['dateRange'][subkey] = None

    return data


@api.route('/scenarios', methods=['GET'])
def get_scenarios():
    """Get all scenarios"""
    try:
        db = current_app.db
        scenarios = list(db.scenarios.find())

        for s in scenarios:
            s['_id'] = str(s['_id'])

        return jsonify(scenarios_schema.dump(scenarios)), 200
    except Exception as e:
        print(f"Error in get_scenarios: {e}")
        return jsonify({'error': str(e)}), 500


@api.route('/scenarios', methods=['POST'])
def create_scenario():
    """Create a new scenario"""
    try:
        db = current_app.db
        data = request.get_json() or {}

        data = normalize_dates(data)

        # Set timestamps explicitly
        now = datetime.now(timezone.utc)
        data['createdAt'] = now
        data['updatedAt'] = now

        errors = scenario_schema.validate(data)
        if errors:
            return jsonify({'errors': errors}), 400

        result = db.scenarios.insert_one(data)
        created = db.scenarios.find_one({'_id': result.inserted_id})
        created['_id'] = str(created['_id'])

        return jsonify(scenario_schema.dump(created)), 201

    except Exception as e:
        print(f"Error in create_scenario: {e}")
        return jsonify({'error': str(e)}), 500


@api.route('/scenarios/<id>', methods=['GET'])
def get_scenario(id):
    """Get single scenario by ID"""
    try:
        db = current_app.db
        scenario = db.scenarios.find_one({'_id': ObjectId(id)})

        if not scenario:
            return jsonify({'error': 'Scenario not found'}), 404

        scenario['_id'] = str(scenario['_id'])
        return jsonify(scenario_schema.dump(scenario)), 200

    except Exception as e:
        print(f"Error in get_scenario: {e}")
        return jsonify({'error': str(e)}), 500


@api.route('/scenarios/<id>', methods=['PUT'])
def update_scenario(id):
    """Update scenario"""
    try:
        db = current_app.db
        data = request.get_json() or {}

        data = normalize_dates(data)
        data['updatedAt'] = datetime.now(timezone.utc)

        # Never allow createdAt to be overwritten
        data.pop('createdAt', None)

        result = db.scenarios.update_one(
            {'_id': ObjectId(id)},
            {'$set': data}
        )

        if result.matched_count == 0:
            return jsonify({'error': 'Scenario not found'}), 404

        updated = db.scenarios.find_one({'_id': ObjectId(id)})
        updated['_id'] = str(updated['_id'])

        return jsonify(scenario_schema.dump(updated)), 200

    except Exception as e:
        print(f"Error in update_scenario: {e}")
        return jsonify({'error': str(e)}), 500


@api.route('/scenarios/<id>', methods=['DELETE'])
def delete_scenario(id):
    """Delete scenario"""
    try:
        db = current_app.db
        result = db.scenarios.delete_one({'_id': ObjectId(id)})

        if result.deleted_count == 0:
            return jsonify({'error': 'Scenario not found'}), 404

        return jsonify({'message': 'Scenario deleted successfully'}), 200

    except Exception as e:
        print(f"Error in delete_scenario: {e}")
        return jsonify({'error': str(e)}), 500


@api.route('/scenarios/<id>/preview', methods=['GET'])
def generate_preview(id):
    """Generate mock preview data for scenario"""
    try:
        db = current_app.db
        scenario = db.scenarios.find_one({'_id': ObjectId(id)})

        if not scenario:
            return jsonify({'error': 'Scenario not found'}), 404

        sales_multiplier = scenario.get('salesMultiplier', 1)
        regions = scenario.get('regions', [])
        categories = scenario.get('productCategories', [])

        mock_data = {
            'salesData': [
                {'date': '2024-01-01', 'sales': 1000 * sales_multiplier},
                {'date': '2024-01-02', 'sales': 1200 * sales_multiplier},
            ],
            'topProducts': categories[:5],
            'regionBreakdown': {region: 100 for region in regions},
        }

        return jsonify(mock_data), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
