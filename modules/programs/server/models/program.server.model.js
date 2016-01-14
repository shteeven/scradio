'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Program Schema
 */
var ProgramSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  profileImageURL: {
    type: String,
    default: 'modules/users/client/img/profile/default.png'
  },
  images: [ String ],
  mixcloud: { type: String },
  categories: [ String ],
  description: {
    en: String,
    kr: String
  },
  user_id: [
    {
      type: Schema.ObjectId,
      ref: 'User'
    }
  ],
  date_time: {
    type: Date
  },
  show_id: {
    type: Schema.ObjectId,
    ref: 'Show'
  }
});

mongoose.model('Program', ProgramSchema);
