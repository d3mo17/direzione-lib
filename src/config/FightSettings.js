/**
 * A library of components that can be used to manage a martial arts tournament
 *
 * Copyright (C) 2023 Daniel Moritz
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
/** @namespace "Direzione.FightSettings" */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['direzione-lib/model/Fight'], factory)
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('../model/Fight'))
    } else {
        root.Direzione = root.Direzione || {};
        root.Direzione.FightSettings = factory(root.Direzione.Fight)
    }
}(this, function (Fight) {

    /**
     * @class
     * @hideconstructor
     * @global
     * @private
     *
     * @borrows <anonymous>~_toStorage as toStorage
     * @borrows <anonymous>~_fromStorage as fromStorage
     */
    function FightSettings() {
        this.duration      = Fight.DURATION
        this.countUpLimit  = Fight.COUNTUP
        this.personLockOut = Fight.LOCK_OUT
        this.fromStorage()
    }

    FightSettings.prototype = {
        toStorage:   _toStorage,
        fromStorage: _fromStorage,
        getDuration: function () { return this.duration },
        getCountUpLimit: function () { return this.countUpLimit },
        getLockOutTime: function () { return this.personLockOut },
        setDuration: function (duration) {
            if (! Number.isInteger(duration)) {
                throw TypeError('Duration has to be of type integer')
            }
            this.duration = duration
            return this
        },
        setCountUpLimit: function (countUpLimit) {
            if (! Number.isInteger(countUpLimit)) {
                throw TypeError('Limit for count up has to be of type integer')
            }
            this.countUpLimit = countUpLimit
            return this
        },
        setLockOutTime: function (lockOutTime) {
            if (! Number.isInteger(lockOutTime)) {
                throw TypeError('The lock-out time has to be of type integer')
            }
            this.personLockOut = lockOutTime
            return this
        }
    }

    /**
     * Puts the settings to the local storage
     *
     * @method  FightSettings#toStorage
     * @public
     */
    function _toStorage() {
        localStorage.setItem('Direzione.FightSettings', JSON.stringify(this))
    }

    /**
     * Fetches the settings from the local storage and applies them to this object
     *
     * @method  FightSettings#fromStorage
     * @public
     */
    function _fromStorage() {
        var obj, settings = localStorage.getItem('Direzione.FightSettings')
        if (settings) {
            obj = JSON.parse(settings)
            Object.keys(obj).forEach(function (key) {
                this[key] = obj[key]
            }, this)
        }
    }

    // Module-API
    return {
        /**
         * Creates an object to manage settings to a fight
         *
         * @static
         * @method     create
         * @memberof   "Direzione.FightSettings"
         * @returns    {FightSettings}
         */
        create: function () {
            return new FightSettings()
        }
    }
}))
