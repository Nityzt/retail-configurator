from flask import Blueprint, request, jsonify, current_app
from bson.objectid import ObjectId
from datetime import datetime, timezone
from app.models import ScenarioSchema

api = Blueprint('api', __name__)
scenario_schema = ScenarioSchema()
scenarios_schema = ScenarioSchema(many=True)

@api.route('/scenarios', methods=['GET'])
def get_scenarios():
    """Get all scenarios with pagination support"""
    try: 
        db = current_app.db 
        scenarios = list(db.scenarios.find())

        # Convert ObjectId to string for JSON serialization
        for scenario in scenarios:
            scenario['_id'] = str(scenario['_id'])

        return jsonify(scenarios_schema.dump(scenarios)), 200
    except Exception as e:
        print(f"Error in get_scenarios: {e}")
        return jsonify({'error': str(e)}), 500
    
@api.route('/scenarios', methods=['POST'])
def create_scenario():
    """Create new scenario"""
    try:
        db = current_app.db  
        

        data = request.get_json()
        print("=" * 50)
        print("Received data:")
        print(data)
        print("=" * 50)

        # Validate with marshmallow
        errors = scenario_schema.validate(data)
        if errors:
            print(f"Validation errors: {errors}")
            return jsonify({'errors': errors}), 400

        print("Validation passed")

        # Add timestamps
        data['createdAt'] = datetime.now(timezone.utc)
        data['updatedAt'] = datetime.now(timezone.utc)

        # Insert into MongoDB
        result = db.scenarios.insert_one(data)
        print(f"Inserted with ID: {result.inserted_id}")

        # Fetch created scenario
        created = db.scenarios.find_one({'_id': result.inserted_id})
        created['_id'] = str(created['_id'])

        return jsonify(scenario_schema.dump(created)), 201
        
    except Exception as e:
        print(f"Error in create_scenario: {e}")
        import traceback
        traceback.print_exc()
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
        db = current_app.db  # FIXED: Use current_app.db
        data = request.get_json()
        data['updatedAt'] = datetime.now(timezone.utc)
        
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