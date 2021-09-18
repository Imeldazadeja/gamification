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

    if (!Array.isArray(filter.populate)) {
        filter.populate = [];
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
        return {skip: 0, populate: []};
    }
}

/**
 * @param {function({request, loggedUser?})} handlerFn
 * @returns {(function(*, *): Promise<void>)|*}
 */
function executeHandler(handlerFn) {
    return async (request, response) => {
        try {
            const result = await handlerFn({request, loggedUser: request.user});
            if (result) {
                response.status(200).json(result);
            } else {
                response.status(204).send();
            }
        } catch (error) {
            console.error('Unhandled error:', error);
            if (error.statusCode) {
                response.status(error.statusCode).send(error);
            } else {
                response.status(500).send('Internal server error');
            }
        }
    };
}

module.exports = {parseFilter, parseFilterFromRequest, executeHandler};

/**
 * @typedef {Object} Filter
 * @property {*} [where]
 * @property {number} skip
 * @property {number} [limit]
 * @property {Array} populate
 */
