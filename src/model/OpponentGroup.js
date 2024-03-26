/**
 * A library of components that can be used to manage a martial arts tournament
 *
 * Copyright (C) 2024 Daniel Moritz
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, according to version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 *
 * @param   {Object} root
 * @param   {Function} factory
 * @license GPL-3.0
 *
 * @returns {Object}
 */
/** @namespace "Direzione.OpponentGroup" */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory)
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory()
    } else {
        root.Direzione = root.Direzione || {}
        root.Direzione.OpponentGroup = factory()
    }
}(this, function () {

    /**
     * @class
     * @hideconstructor
     * @global
     * @private
     *
     * @param {String} name
     */
    function OpponentGroup(name) {
        this[' name'] = name
        this[' persons'] = []

        this[' listener'] = { add: [], remove: [] }
    }

    OpponentGroup.prototype = {
        addPerson: function (person) {
            _dispatch.call(this, 'add', person)
            this[' persons'].push(person)
        },
        removePerson: function (person) {
            _dispatch.call(this, 'remove', person)
            this[' persons'] = this[' persons'].filter(function(obj) {
                return obj !== person;
            })
        },
        getPersons: function () { return this[' persons'] },
        on: _registerEventListener,
        getName: function () { return this[' name'] }
    }

    /**
     * Registers an event-listener to this object
     *
     * @method  Opponent#on
     * @param   {String} type
     * @param   {Function} callback
     * @public
     */
    function _registerEventListener(type, callback) {
        var eventTypes = Object.keys(this[' listener'])
        if (eventTypes.indexOf(type) === -1) {
            throw new RangeError(
                'Only following values are allowed for event type: ' + eventTypes.join(', ') + '!'
            )
        }

        this[' listener'][type].push(callback)

        return this
    }

    /**
     * Notifies all listeners of passed event-type.
     *
     * @private
     * @param {String} type
     * @param {*} data
     */
    function _dispatch(type, data) {
        this[' listener'][type].forEach(function (listener) {
            listener.call(this, data)
        }, this)
    }

    // Module-API
    return {
        /**
         * Creates an object to organize opponents in groups.
         *
         * @static
         * @method   create
         * @memberof "Direzione.OpponentGroup"
         * @param    {String} name
         * @returns  {OpponentGroup}
         */
        create: function (name) {
            return new OpponentGroup(name)
        }
    }
}))
