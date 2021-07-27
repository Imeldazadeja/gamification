'use strict';

const {Types: {ObjectId}} = require('mongoose');

function handleWhereFilter(parent, propertyName, value) {
  if (typeof value === 'object') {
    if (value['$oid']) {
      parent[propertyName] = new ObjectId(value['$oid']);
    } else if (value['$d']) {
      const date = new Date(value['$d']);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }

      parent[propertyName] = date;
    } else {
      for (const [propName, propValue] of Object.entries(value)) {
        handleWhereFilter(value, propName, propValue);
      }
    }
  } else if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      handleWhereFilter(value, i, value[i]);
    }
  }
}

// {studentId: {"oid": 'fasdfdsa'}, age: 20} -> [[studentId, {'oid': '25435234'}], ['age', 20]]
// {and: [{status: ''}, or: []], status: {}}


/**
 * @param {*} filter
 * @returns {Filter}
 */
function parseFilter(filter) {
  if (filter.where) {
    for (const [propertyName, value] of Object.entries(filter.where)) {
      handleWhereFilter(filter.where, propertyName, value);
    }
  }

  if (!Number.isInteger(filter.skip)) {
    filter.skip = 0;
  }
  // if (!Number.isInteger(filter.limit)) {
  //   filter.limit = 0;
  // }

  return filter;
}

/**
 * @param {*} request
 * @returns {Filter}
 */
function parseFilterFromRequest(request) {
  try {
    const filter = request.query && request.query.filter ? JSON.parse(decodeURIComponent(request.query.filter)) : {};
    return parseFilter(filter);
  } catch (err) {
    return {};
  }
}

module.exports = {parseFilter, parseFilterFromRequest};

/**
 * @typedef {Object} Filter
 * @property {*} [where]
 * @property {number} [skip]
 * @property {number} [limit]
 */
