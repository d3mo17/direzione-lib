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

    var SETTINGS  = ['duration', 'countUpLimit', 'countUpLimitIppon', 'personLockOut', 'timeUpSoundFile']

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
        this.duration          = Fight.DURATION
        this.countUpLimit      = Fight.COUNTUP
        this.countUpLimitIppon = Fight.COUNTUP * 2
        this.personLockOut     = Fight.LOCK_OUT
        this.invertGripDisplay = false
        this.invertGripSide    = false
        this.timeUpSoundFile   = ''

        this.fromStorage()
        this.fromURLParameters()
    }

    FightSettings.prototype = {
        toStorage:             _toStorage,
        fromStorage:           _fromStorage,
        fromURLParameters:     _fromURLParameters,
        getDuration:           function () { return this.duration },
        getCountUpLimit:       function () { return this.countUpLimit },
        getCountUpLimitIppon:  function () { return this.countUpLimitIppon },
        getLockOutTime:        function () { return this.personLockOut },
        isGripDisplayInverted: function () { return this.invertGripDisplay },
        isGripSideInverted:    function () { return this.invertGripSide },
        getTimeUpSoundFile:    function () { return this.timeUpSoundFile },
        setDuration: function (duration) {
            if (! Number.isInteger(duration)) {
                throw TypeError('Duration has to be of type integer')
            }
            this.duration = duration
            return this
        },
        setCountUpLimit: function (countUpLimit) {
            if (! Number.isInteger(countUpLimit)) {
                throw TypeError('Limit for count up (wazari) has to be of type integer')
            }
            this.countUpLimit = countUpLimit
            return this
        },
        setCountUpLimitIppon: function (countUpLimit) {
            if (! Number.isInteger(countUpLimit)) {
                throw TypeError('Limit for count up (ippon) has to be of type integer')
            }
            this.countUpLimitIppon = countUpLimit
            return this
        },
        setLockOutTime: function (lockOutTime) {
            if (! Number.isInteger(lockOutTime)) {
                throw TypeError('The lock-out time has to be of type integer')
            }
            this.personLockOut = lockOutTime
            return this
        },
        setGripDisplayInverted: function (enable) {
            this.invertGripDisplay = !!enable
            return this
        },
        setGripSideInverted: function (enable) {
            this.invertGripSide = !!enable
            return this
        },
        setTimeUpSoundFile: function (filename) {
            this.timeUpSoundFile = filename
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

    /**
     * Fetches the settings from url parameters given in query and applies them to this object
     *
     * @method  AppSettings#fromURLParameters
     * @public
     */
    function _fromURLParameters() {
        var urlParams = new URLSearchParams(window.location.search)
        Array.from(urlParams.entries()).forEach(function (entry) {
            SETTINGS.includes(entry[0]) && (this[entry[0]] = entry[1])
        }, this)
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
