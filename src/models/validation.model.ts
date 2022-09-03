import { ParamSchema, Schema } from 'express-validator';
import { ObjectId } from 'mongodb';

export let ObjectIdValidator: ParamSchema = {
    custom: {
        options: (value, { req, location, path }) => {
          return ObjectId.isValid(value);
        },
        errorMessage: '_id must be in ObjectId format!'
      },
      isEmpty: {
        negated: true,
        errorMessage: '_id must not be null!'
      }
}
