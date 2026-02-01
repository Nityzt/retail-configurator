from flask import Blueprint, request, jsonify, current_app
from bson.objectid import ObjectId
from datetime import datetime
from app.models import ScenarioSchema
from datetime import datetime, timezone

api = Blueprint('api', __name__)
scenario_schema = ScenarioSchema()
scenarios_schema = ScenarioSchema(many=True)

@api.route('/scenarios', methods=['GET'])
def get_scenarios():
    """Get all scenarios with pagination support"""
    try: 
        db = current_app.config['db']
        scenarios = list(db.scenarios.find())

        #convert ObjectId to string for JSON serialization
        for scenario in scenarios:
            scenario['_id'] = str(scenario['_id'])

        return jsonify(scenario_schema.dump(scenarios)), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@api.route('/scenarios', methods=['POST'])
def create_scenario():
    """Create new scenario"""
    try:
        data = request.get_json()

        errors = scenario_schema.validate(data)
        if errors:
            return jsonify({'errors': errors}), 400


        data['createdAt'] = datetime.now(timezone('US/Eastern'))
        data['updatedAt'] = datetime.now(timezone('US/Eastern'))

        db = current_app.config['DB']
        result = db.scenarios.insert_one(data)

        created = db.scenarios.find_one({'_id': result.inserted_id})
        created['_id'] = str(created['_id'])

        return jsonify(scenario_schema.dumb(created)), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
        

@api.route('/scenarios/<id>', methods=['GET'])
def get_scenario(id):
    """Get single scenario by ID"""
    try:
        db = current_app.config['DB']
        scenario = db.scenarios.find_one({'_id': ObjectId(id)})
        
        if not scenario:
            return jsonify({'error': 'Scenario not found'}), 404
        
        scenario['_id'] = str(scenario['_id'])
        return jsonify(scenario_schema.dump(scenario)), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api.route('/scenarios/<id>', methods=['PUT'])
def update_scenario(id):
    """Update scenario"""
    try:
        data = request.get_json()
        data['updatedAt'] = datetime.now(timezone('US/Eastern'))
        
        db = current_app.config['DB']
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
        return jsonify({'error': str(e)}), 500

@api.route('/scenarios/<id>', methods=['DELETE'])
def delete_scenario(id):
    """Delete scenario"""

    try:
        db = current_app.config['DB']
        result = db.scenarios.delete_one({'_id': ObjectId(id)})

        if result.deleted_count == 0:
            return jsonify({'error': 'Scenario not found'}), 404
        
        return jsonify({'message': 'Scenario deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500



