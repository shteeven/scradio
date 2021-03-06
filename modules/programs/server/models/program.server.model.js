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
  social: {
    mixcloud: { type: String },
    facebook: { type: String },
    twitter: { type: String },
    homepage: { type: String }
  },
  categories: [ String ],
  description: {
    en: String,
    kr: String
  },
  starId: [
    {
      type: Schema.ObjectId,
      ref: 'Star'
    }
  ]
});

mongoose.model('Program', ProgramSchema);
