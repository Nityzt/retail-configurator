from marshmallow import Schema, fields, validate
from datetime import datetime

class DateRangeSchema(Schema):
    start = fields.Str(required=True)
    end = fields.Str(required=True)

class ScenarioSchema(Schema):
    _id = fields.Str(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=3))
    dateRange = fields.Nested(DateRangeSchema, required=True)
    productCategories = fields.List(fields.Str(), required=True, validate=validate.Length(min=1))
    salesMultiplier = fields.Float(required=True, validate=validate.Range(min=0.5, max=3.0))
    regions = fields.List(fields.Str(), required=True, validate=validate.Length(min=1))
    customerSegments = fields.List(fields.Str(), required=True, validate=validate.Length(min=1))
    createdAt = fields.DateTime(dump_only=True)
    updatedAt = fields.DateTime(dump_only=True)