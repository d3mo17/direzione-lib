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
/** @namespace "Direzione.Scoreboard" */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['direzione-lib/model/Fight', 'direzione-lib/util/Utils'], factory)
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('../model/Fight'), require('../util/Utils'))
    } else {
        root.Direzione = root.Direzione || {}
        root.Direzione.Scoreboard = factory(root.Direzione.Fight, root.Direzione.Utils)
    }
}(this, function (Fight, Utils) {

    /**
     * @class
     * @hideconstructor
     * @global
     * @private
     *
     * @param   {Fight}  fightModel
     * @param   {Object} viewConfig
     */
    function Scoreboard(fightModel, viewConfig) {
        this[' fight'] = fightModel
        this[' outputElems'] = {
            countdown:     viewConfig.outputElemCountdown,
            clockSec:      viewConfig.outputElemStopwatchSeconds,
            clockMSec:     viewConfig.outputElemStopwatchMilliseconds,
            whiteScore:    viewConfig.outputElemWhiteScore,
            redScore:      viewConfig.outputElemRedScore,
            whiteShido:    viewConfig.outputElemWhiteShido,
            redShido:      viewConfig.outputElemRedShido,
            whiteOpponent: viewConfig.outputElemWhiteOpponent,
            redOpponent:   viewConfig.outputElemRedOpponent,
            whiteClub:     viewConfig.outputElemWhiteClub,
            redClub:       viewConfig.outputElemRedClub
        }

        this[' initValMemCountdown'] = viewConfig.outputElemCountdown.innerText
        this.showNames()
        this.run()
    }
    Scoreboard.prototype = {
        replaceFight: function (fightModel) {
            this.stop()
            this[' fight'] = fightModel
            this.showNames()
            this.run()
        },
        run: function () {
            this[' allowRun'] = true
            requestAnimationFrame(this[' animationLoop'] = function() {
                _updateView.call(this)
                this[' allowRun']
                    ? requestAnimationFrame(this[' animationLoop'])
                    : (this[' allowRun'] = true)
            }.bind(this))
        },
        stop: function () {
            this[' allowRun'] = false
        },
        showNames: function () {
            this[' outputElems'].whiteOpponent.innerText = this[' fight'].getWhiteOpponent().getFullName()
            this[' outputElems'].redOpponent.innerText   = this[' fight'].getRedOpponent().getFullName()
            this[' outputElems'].whiteClub.innerText     = this[' fight'].getWhiteOpponent().getPerson().getClubName()
            this[' outputElems'].redClub.innerText       = this[' fight'].getRedOpponent().getPerson().getClubName()
        },
        hideNames: function () {
            this[' outputElems'].whiteOpponent.innerText = ''
            this[' outputElems'].redOpponent.innerText   = ''
            this[' outputElems'].whiteClub.innerText   = ''
            this[' outputElems'].redClub.innerText     = ''
        },
        shutdown: function () {
            this.stop()
            this.hideNames()
            requestAnimationFrame(function () {
                this[' outputElems'].countdown.innerText   = this[' initValMemCountdown']
                this[' outputElems'].clockSec.innerText    = _displaySecPassed(0)
                this[' outputElems'].clockMSec.innerText   = _displayMSecPassed(0)
                this[' outputElems'].clockSec.parentNode.className = Fight.SIDE_CENTER

                this[' outputElems'].whiteScore.innerText = 0
                this[' outputElems'].redScore.innerText   = 0

                this[' outputElems'].whiteShido.innerText = 0
                this[' outputElems'].redShido.innerText   = 0
            }.bind(this))
        }
    }

    /**
     * Starts the update process for the display
     *
     * @method  Scoreboard#run
     * @public
     */

    /**
     * Stops the update process for the display
     *
     * @method  Scoreboard#stop
     * @public
     */

    /**
     * Replaces the present fight
     *
     * @method  Scoreboard#replaceFight
     * @public
     */

    /**
     * Displays Names of opponents
     *
     * @method  Scoreboard#showNames
     * @public
     */

    /**
     * Hides Names of opponents
     *
     * @method  Scoreboard#hideNames
     * @public
     */

    /**
     * Shuts the scoreboard display down
     *
     * @method  Scoreboard#shutdown
     * @public
     */

    /**
     * Extracts last three milliseconds and fills up with zeros to the left, if necessary
     *
     * @private
     * @param   {Integer} msec
     * @returns {String}
     */
    function _displayMSecPassed(msec) {
        return (Math.floor(msec%1000)+'').padStart(3,'0')
    }

    /**
     * Extracts seconds (without minutes) from  milliseconds
     *
     * @private
     * @param   {Integer} msec
     * @returns {Integer}
     */
    function _displaySecPassed(msec) {
        return Math.floor(msec / 1000)%60
    }

    /**
     * Shows the data of given fight
     *
     * @private
     */
    function _updateView() {
        this[' outputElems'].countdown.innerText = Utils.getMinSecDisplay(this[' fight'].getTimeLeft())
        var countup = this[' fight'].getCountUp()
        if (countup) {
            var milliseconds = countup.get()
            this[' outputElems'].clockSec.innerText  = _displaySecPassed(milliseconds)
            this[' outputElems'].clockMSec.innerText = _displayMSecPassed(milliseconds)
            this[' outputElems'].clockSec.parentNode.className = countup.side
        } else {
            this[' outputElems'].clockSec.innerText  = _displaySecPassed(0)
            this[' outputElems'].clockMSec.innerText = _displayMSecPassed(0)
            this[' outputElems'].clockSec.parentNode.className = Fight.SIDE_CENTER
        }

        this[' outputElems'].whiteScore.innerText = this[' fight'].getWhiteOpponent().getScore()
        this[' outputElems'].redScore.innerText   = this[' fight'].getRedOpponent().getScore()

        this[' outputElems'].whiteShido.innerText = this[' fight'].getWhiteOpponent().getShido()
        this[' outputElems'].redShido.innerText   = this[' fight'].getRedOpponent().getShido()
    }

    // Module-API
    return {
        /**
         * Creates an object to update a scoreboard.
         *
         * @static
         * @method   create
         * @memberof "Direzione.Scoreboard"
         * @param   {Fight}  fightModel
         * @param   {Object} viewConfig
         * @returns {Scoreboard}
         */
        create: function (fightModel, viewConfig) {
            return new Scoreboard(fightModel, viewConfig)
        }
    };
}));
