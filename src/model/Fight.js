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
 *
 * @license GPL-3.0
 *
 * @returns {Object}
 */
/** @namespace "Direzione.Fight" */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['durata/dist/durata.min', 'direzione-lib/model/FightHistory'], factory)
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('durata'), require('./FightHistory'))
    } else {
        root.Direzione = root.Direzione || {}
        root.Direzione.Fight = factory(root.Durata, root.Direzione.FightHistory)
    }
}(this, function (Durata, FightHistory) {

    /**
     * @class
     * @hideconstructor
     * @global
     * @private
     *
     * @param   {FightSettings} settings
     * @param   {Opponent} whiteOpponent
     * @param   {Opponent} redOpponent
     * @param   {Boolean} noHistory
     *
     * @borrows <anonymous>~_removeAllEventListeners as clearListeners
     * @borrows <anonymous>~_getTimeLeft as getTimeLeft
     * @borrows <anonymous>~_isRunning as isRunning
     * @borrows <anonymous>~_registerEventListener as on
     * @borrows <anonymous>~_reset as reset
     * @borrows <anonymous>~_startPauseResume as startPauseResume
     * @borrows <anonymous>~_osaeKomi as osaeKomi
     * @borrows <anonymous>~_stop as stop
     * @borrows <anonymous>~_toketa as toketa
     */
    function Fight(settings, whiteOpponent, redOpponent, noHistory) {
        this[' settings']      = settings
        this[' whiteOpponent'] = whiteOpponent
        this[' redOpponent']   = redOpponent

        this[' history']  = (typeof noHistory !== 'undefined') && !!noHistory
            ? false : FightHistory.create(this)

        this[' stopped']  = false
        this[' listener'] = { reset: [], startPauseResume: [], osaeKomi: [], stop: [], toketa: [], removeCountUp: [], timeUp: [] }
    }


    /**
     * Duration of a fight (in milliseconds)
     * @readonly
     * @const {number}
     */
    Fight.DURATION = 3 * 60 * 1000 // ms

    /**
     * Maximum count up (in milliseconds)
     * @readonly
     * @const {number}
     */
    Fight.COUNTUP = 10 * 1000 // ms

    /**
     * Lock-out of persons after a fight (in milliseconds)
     * @readonly
     * @const {number}
     */
    Fight.LOCK_OUT = 10 * 60 * 1000 // ms

    Fight.SIDE_WHITE  = 'white'
    Fight.SIDE_RED    = 'red'
    Fight.SIDE_CENTER = 'center'

    Fight.prototype = {
        clearListeners:   _removeAllEventListeners,
        getHistory:       function () { return this[' history'] },
        getCountdown:     function () { return _countdownExists.call(this) && this[' countdown'] },
        getCountUp:       function () { return _countUpExists.call(this) && this[' countup'] },
        getWhiteOpponent: function () { return this[' whiteOpponent'] },
        getRedOpponent:   function () { return this[' redOpponent'] },
        getTimeLeft:      _getTimeLeft,
        isRunning:        _isRunning,
        isStopped:        function () { return this[' stopped'] },
        invertSide:       _invertSide,
        on:               _registerEventListener,
        removeCountUp:    _removeCountUp,
        reset:            _reset,
        startPauseResume: _startPauseResume,
        osaeKomi:         _osaeKomi,
        stop:             _stop,
        toketa:           _toketa
    }

    /**
     * Returns the object that holds the fight history
     *
     * @method  Fight#getHistory
     * @public
     * @returns {FightHistory}
     */

    /**
     * Returns the object to process countdown
     *
     * @method  Fight#getCountDown
     * @public
     * @returns {DurataSingleValue|false}
     */

    /**
     * Returns the object to process count up
     *
     * @method  Fight#getCountUp
     * @public
     * @returns {DurataSingleValue|false}
     */

    /**
     * Returns the object to manage the judika on white side
     *
     * @method  Fight#getWhiteOpponent
     * @public
     * @returns {Opponent}
     */

    /**
     * Returns the object to manage the judika on red side
     *
     * @method  Fight#getRedOpponent
     * @public
     * @returns {Opponent}
     */

    /**
     * Returns whether the fight is going on
     *
     * @method  Fight#isStopped
     * @public
     * @returns {Boolean}
     */

    /**
     * Inverts passed side; Makes left from right and right from left - keeps center ...
     *
     * @method  Fight#invertSide
     * @public
     * @returns {String}
     */

    /**
     * Returns whether the fight is still going on
     *
     * @method  Fight#isRunning
     * @public
     * @returns {Boolean}
     */
    function _isRunning() {
        return !this[' stopped'] &&
            _countdownExists.call(this) &&
            !this[' countdown'].isPaused() &&
            !this[' countdown'].isComplete()
    }

    /**
     * Returns whether the object to process the countdown is available
     *
     * @private
     * @returns {Boolean}
     */
    function _countdownExists() {
        return typeof this[' countdown'] !== 'undefined'
    }

    /**
     * Returns whether the object to count up is available
     *
     * @private
     * @returns {Boolean}
     */
    function _countUpExists() {
        return typeof this[' countup'] !== 'undefined'
    }

    /**
     * Returns remainig milliseconds until the fight ends
     *
     * @method  Fight#getTimeLeft
     * @private
     * @returns {Integer}
     */
    function _getTimeLeft() {
        return _countdownExists.call(this) ? this[' countdown'].get() : this[' settings'].getDuration()
    }

    /**
     * Registers an event-listener to this object
     *
     * @method  Fight#on
     * @param   {String} type
     * @param   {Function} callback
     * @private
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
     * Removes all listeners of this object
     *
     * @method Fight#clearListeners
     * @param  {Boolean} externalOnly Default `true`
     * @public
     */
    function _removeAllEventListeners(externalOnly) {
        externalOnly = typeof externalOnly === 'undefined' ? true : externalOnly

        var eventTypes = Object.keys(this[' listener'])
        eventTypes.forEach(function (key) {
            delete this[' listener'][key]
            this[' listener'][key] = []
        }, this)

        this.getRedOpponent().clearListeners()
        this.getWhiteOpponent().clearListeners()

        externalOnly && !!this.getHistory() && this.getHistory().registerEventListeners()
    }

    /**
     * Removes the count up procedure
     *
     * @private
     * @fires   Fight#removeCountUp
     */
    function _removeCountUp() {
        if (_countUpExists.call(this)) {
            this[' countup'].stop('reset')
            delete this[' countup']
            _dispatch.call(this, 'removeCountUp')
        }
    }

    /**
     * Resets the fight (Time and score to initial values)
     *
     * @method  Fight#reset
     * @fires   Fight#reset
     * @public
     * @param   {Integer} forceMS Optional - If this is passed to the function, the countdown will be
     *                            forced to this millisecond value
     */
    function _reset(forceMS) {
        this[' stopped'] = false
        _removeCountUp.call(this)
        _countdownExists.call(this) && this[' countdown'].stop('interrupt')
        _newCountDown.call(this, forceMS)
        this[' countdown'].pause('reset')
        this[' whiteOpponent'].reset()
        this[' redOpponent'].reset()

        // do not register event listeners, if milliseconds were passed, because this means the
        // fight is controlled from the outside were the logic happens
        if (typeof forceMS !== 'undefined') return

        _dispatch.call(this, 'reset', _countdownExists.call(this) ? this[' countdown'].get() : undefined )
    }

    /**
     * Toggles pause and resume for the countdown
     *
     * @private
     * @method  Fight#togglePauseResume
     */
    function _togglePauseResume() {
        this.isStopped()
            || this[' countdown'].isPaused() && this[' countdown'].resume('toggle')
            || this[' countdown'].pause('toggle')
    }

    /**
     * Creates a new object for the countdown
     *
     * @private
     * @param   {Integer} forceMS Optional milliseconds the start of countdown should be set to
     */
    function _newCountDown(forceMS) {
        var local_ms = typeof forceMS !== 'undefined' ? forceMS : this[' settings'].getDuration()
        _countdownExists.call(this) && this[' countdown'].stop('dirty')
        this[' countdown'] = Durata.create(local_ms, 0, local_ms)
                                .on('resume', _removeCountUp.bind(this))
                                .on('pause', function (reason) {
                                    reason === 'osaekomi-timeup' && _dispatch.call(this, 'timeUp')
                                }.bind(this))

        // do not register event listeners, if milliseconds were passed, because this means the
        // fight is controlled from the outside were the logic happens
        if (typeof forceMS !== 'undefined') return

        this[' countdown']
            .on('complete', _dispatch.bind(this, 'timeUp'))
            .on('pause',    _toketa.bind(this, undefined))
    }

    /**
     * Starts, pauses or resumes the fight
     *
     * @method  Fight#startPauseResume
     * @fires   Fight#startPauseResume
     * @private
     * @param   {Integer} forceMS Optional milliseconds the countdown should be forced to
     */
    function _startPauseResume(forceMS) {
        if (this.isStopped()) return

        if (!_countdownExists.call(this)) {
            _newCountDown.call(this, forceMS)
        } else {
            if (this[' countdown'].isComplete()) return
            if (typeof forceMS !== 'undefined') {
                var paused = this[' countdown'].isPaused()
                _newCountDown.call(this, forceMS)
                paused && this[' countdown'].pause('renew')
            }
            _togglePauseResume.call(this)
        }

        // do not register event listeners, if milliseconds were passed, because this means the
        // fight is controlled from the outside were the logic happens
        if (typeof forceMS !== 'undefined') return

        _dispatch.call(this, 'startPauseResume', this[' countdown'].get())
    }

    /**
     * Inverts passed side; Makes left from right and right from left - keeps center ...
     *
     * @private
     * @param   {String} side
     */
    function _invertSide(side) {
        if (side === Fight.SIDE_CENTER) return Fight.SIDE_CENTER
        return side === Fight.SIDE_RED ? Fight.SIDE_WHITE : Fight.SIDE_RED
    }

    /**
     * Creates a new object for the count up
     *
     * @private
     * @fires   Fight#toketa
     * @param   {String}  side defines which opponent holds the other down ("red", "white" or "center")
     * @param   {Integer} forceMS Optional milliseconds the start of count up should be set to
     */
    function _newCountUp(side, forceMS) {
        var local_ms   = forceMS || 0
        var countUp_ms = this[' settings'].getCountUpLimit()
        var to = typeof forceMS !== 'undefined' ? this[' settings'].getCountUpLimitIppon() : countUp_ms
        _countUpExists.call(this) && this[' countup'].stop('dirty')
        this[' countup'] = Durata.create(local_ms, to, to - local_ms)
        this[' countup'].side = side

        // do not register event listeners, if milliseconds were passed, because this means the
        // fight is controlled from the outside were the logic happens
        if (typeof forceMS !== 'undefined') return

        this[' countup'].on('pause', function () {
            _dispatch.call(this, 'toketa', this[' countup'].get())
        }.bind(this)).on('complete', function () {
            if (this[' ' + this[' countup'].side + 'Opponent'].getScore() !== 0) {
                ! this[' countdown'].isPaused() && this[' countdown'].pause('osaekomi-timeup')
            } else {
                this[' countup'].stop('replace')
                _newCountUp.call(this, this[' countup'].side, countUp_ms)
                this[' countup'].on('pause', function () {
                    _dispatch.call(this, 'toketa', this[' countup'].get())
                }.bind(this)).on('complete', function () {
                    ! this[' countdown'].isPaused() && this[' countdown'].pause('osaekomi-timeup')
                }.bind(this))
            }
        }.bind(this))
    }

    /**
     * Starts count up for osae komi
     *
     * @method  Fight#osaeKomi
     * @fires   Fight#osaeKomi
     * @param   {String}  side defines which opponent holds the other down ("red", "white" or "center")
     * @param   {Integer} forceMS Milliseconds the count up should be forced to
     * @private
     */
    function _osaeKomi(side, forceMS) {
        if (typeof forceMS === 'undefined' && (
                this.isStopped() ||
                !_countdownExists.call(this) ||
                this[' countdown'].isPaused()
        )) return

        side = side || Fight.SIDE_CENTER
        side = this[' settings'].isGripSideInverted() ? _invertSide(side) : side

        if (!_countUpExists.call(this) || this[' countup'].isPaused() || typeof forceMS !== 'undefined') {
            _newCountUp.call(this, side, forceMS)
        } else {
            this[' countup'].side = side
        }

        // do not register event listeners, if milliseconds were passed, because this means the
        // fight is controlled from the outside were the logic happens
        if (typeof forceMS !== 'undefined') return

        _dispatch.call(this, 'osaeKomi', this[' settings'].isGripSideInverted() ? _invertSide(side) : side)
    }

    /**
     * Stops the fight
     *
     * @method  Fight#stop
     * @fires   Fight#stop
     * @param   {Integer} msDownForce Optional milliseconds the countdown should be forced to
     * @param   {Integer} msUpForce Optional milliseconds the count up should be forced to
     * @param   {String}  side defines which opponent holds the other down ("red", "white" or "center")
     * @private
     */
    function _stop(msDownForce, msUpForce, side) {
        this[' stopped'] = true
        if (typeof msDownForce === 'undefined') {
            this[' countdown'].stop('timeup')
        } else {
            _newCountDown.call(this, msDownForce)
            this[' countdown'].stop('timeup')
            _newCountUp.call(this, side, msUpForce)
        }
        _countUpExists.call(this) && this[' countup'].stop('timeup')

        // do not register event listeners, if milliseconds were passed, because this means the
        // fight is controlled from the outside were the logic happens
        if (typeof msDownForce !== 'undefined') return

        this[' whiteOpponent'].getPerson().setLockOut(this[' settings'].getLockOutTime())
        this[' redOpponent'].getPerson().setLockOut(this[' settings'].getLockOutTime())

        _dispatch.call(
            this, 'stop', [
                this[' countdown'].get(),
                _countUpExists.call(this) ? this[' countup'].get() : 0,
                _countUpExists.call(this) ? this[' countup'].side  : Fight.SIDE_CENTER
            ]
        )
    }

    /**
     * Pauses the count up for osae komi
     *
     * @method  Fight#toketa
     * @param   {Integer} forceMS Optional milliseconds the count up should be forced to
     * @private
     */
    function _toketa(forceMS) {
        if (typeof forceMS !== 'undefined') {
            _newCountUp.call(this, this[' countup'].side, forceMS)
        }

        _countUpExists.call(this) && this[' countup'].pause('toketa')
    }

    /**
     * Notifies all listeners of passed event-type.
     *
     * @private
     * @param {String} type
     * @param {*} data
     */
    function _dispatch(type, data) {
        !!this[' history'] && this[' history'].insert(type, data)

        this[' listener'][type].forEach(function (listener) {
            listener.call(this, data)
        }, this)
    }


    /**
     * Will be fired when the score and time of a fight has been reset
     * @event Fight#reset
     */

    /**
     * Will be fired when countdown has been started, paused or resumed
     * @event Fight#startPauseResume
     */

    /**
     * Will be fired when count up has been started
     * @event Fight#osaeKomi
     */

    /**
     * Will be fired when the countdown has been stopped (fight ended)
     * @event Fight#stop
     */

    /**
     * Will be fired when count up has been stopped
     * @event Fight#toketa
     */

    /**
     * Will be fired when count up has been removed
     * @event Fight#removeCountUp
     */

    // Module-API
    return {
        /**
         * Creates an object to manage a fight.
         *
         * @static
         * @method   create
         * @memberof "Direzione.Fight"
         * @param    {FightSettings} settings
         * @param    {Opponent}      thousandsSeparator
         * @param    {Opponent}      decimalCount
         * @param    {Boolean}       noHistory
         * @returns  {Fight}
         */
        create: function (settings, whiteOpponent, redOpponent, noHistory) {
            return new Fight(settings, whiteOpponent, redOpponent, noHistory);
        },

        // Constants to make accessable:
        DURATION:    Fight.DURATION,
        COUNTUP:     Fight.COUNTUP,
        LOCK_OUT:    Fight.LOCK_OUT,
        SIDE_WHITE:  Fight.SIDE_WHITE,
        SIDE_RED:    Fight.SIDE_RED,
        SIDE_CENTER: Fight.SIDE_CENTER
    }
}))
