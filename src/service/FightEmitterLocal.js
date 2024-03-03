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
 *
 * @license GPL-3.0
 *
 * @returns {Object}
 */
/** @namespace "Direzione.FightEmitterLocal" */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['direzione-lib/service/LocalBroker'], factory)
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('./LocalBroker'))
    } else {
        root.Direzione = root.Direzione || {};
        root.Direzione.FightEmitterLocal = factory(root.Direzione.LocalBroker)
    }
}(this, function (broker) {

    /**
     * @class
     * @hideconstructor
     * @global
     * @private
     *
     * @param   {String}  receiverID
     * @param   {Fight}   fight
     *
     * @borrows <anonymous>~_connect as connect
     * @borrows <anonymous>~_registerEventListener as on
     */
    function FightEmitterLocal(receiverID, fight) {

        this[' localPeer']  = new RTCPeerConnection()
        this[' fight']      = fight
        this[' receiverID'] = receiverID
        this[' connected']  = false
        this[' conn']       = false
        this[' listener']   = {disconnect: [], establish: []}

        _initBroker.call(this)
        _registerFightHandlers.call(this)
    }
    FightEmitterLocal.prototype = {
        connect:     _connect,
        disconnect:  _disconnect,
        isConnected: function () {
            return this[' connected']
        },
        on: _registerEventListener,
        getFight: function () {
            return this[' fight']
        },
        replaceFight: function (fight) {
            this.disconnect()
            this[' fight'].clearListeners()
            delete this[' fight']
            this[' fight'] = fight
            _registerFightHandlers.call(this)
        }
    }

    /**
     * Returns whether the connection to a FightReceiver is established
     *
     * @method  FightEmitterLocal#isConnected
     * @public
     * @returns {Boolean}
     */

    /**
     * Returns the fight
     *
     * @method FightEmitterLocal#getFight
     * @public
     */

    /**
     * Replaces the fight of this emitter and emits the new object
     *
     * @method FightEmitterLocal#replaceFight
     * @public
     */

    /**
     *
     * @private
     */
    function _initBroker() {
        var b = broker.create(this[' localPeer'])
        this[' broker'] = b

        this[' localPeer'].onicecandidate      = function (e) { b.send({ candidate: e.candidate }) }
        this[' localPeer'].onnegotiationneeded = function () {
            this[' localPeer'].createOffer()
                .then(function (offer) { return this[' localPeer'].setLocalDescription(offer); }.bind(this))
                .then(function () { b.send({ sdp: this[' localPeer'].localDescription }) }.bind(this))
        }.bind(this)
    }

    /**
     * Emits fight over the connection, if established
     *
     * @private
     */
    function _emitFight() {
        var cu;
        function opponent4Emitter(side, opponent) {
            return [
                'new', side,
                opponent.getPerson().getFirstName(),
                opponent.getPerson().getLastName(),
                opponent.getPerson().getClubName(),
                opponent.getScore(),
                opponent.getShido()
            ]
        }

        _send.call(this, opponent4Emitter('white', this[' fight'].getWhiteOpponent()));
        _send.call(this, opponent4Emitter('red',   this[' fight'].getRedOpponent()));
        _send.call(this, [
            'new', 'fight', this[' fight'].getTimeLeft(),
            this[' fight'][' settings'].getCountUpLimit(),
            this[' fight'][' settings'].getCountUpLimitIppon(),
            this[' fight'][' settings'].isGripDisplayInverted(),
            this[' fight'][' settings'].isGripSideInverted()
        ]);
        if (this[' fight'].isRunning()) {
            _send.call(this, ['fight', 'startPauseResume', this[' fight'].getTimeLeft()])
        }
        if (cu = this[' fight'].getCountUp()) {
            var status = cu.isComplete() ? 4 : cu.isStopped() ? 3 : cu.isPaused() ? 2 : 1
            var side   = this[' fight'][' settings'].isGripSideInverted()
                            ? this[' fight'].invertSide(cu.side) : cu.side
            _send.call(this, ['new', 'countup', side, cu.get(), status])
        }
    }

    /**
     * Trys to disconnect from the connected FightReceiver
     *
     * @public
     * @method  FightEmitterLocal#disconnect
     */
    function _disconnect() {
        return this[' connected'] && this[' conn'].close() || true
    }

    /**
     * Trys to connect to a FightReceiver with given ID
     *
     * @public
     * @method  FightEmitterLocal#connect
     * @fires   FightEmitterLocal#establish
     * @fires   FightEmitterLocal#disconnect
     * @returns {Promise}
     */
    function _connect() {
        var deferred = {resolve: null, reject: null};
        deferred.promise = new Promise(function (resolve, reject) {
            deferred.resolve = resolve
            deferred.reject  = reject
        })

        this[' conn'] = this[' localPeer'].createDataChannel(this[' receiverID'])
        this[' conn'].onopen = function() {
            this[' connected'] = true
            _emitFight.call(this)
            this[' broker'].close()
            _dispatch.call(this, 'establish', 'peer opened')
            deferred.resolve()
        }.bind(this)
        this[' conn'].onclose = function() {
            this[' connected'] = false
            _dispatch.call(this, 'disconnect', 'peer closed')
        }.bind(this)

        return deferred.promise
    }

    /**
     * Sends data over the connection, if established
     *
     * @private
     */
    function _send(data) {
        this.isConnected() && this[' conn'].send(JSON.stringify(data))
    }

    /**
     * Registers handlers that listening on events fired by components of the fight
     *
     * @private
     */
    function _registerFightHandlers() {
        var red   = this[' fight'].getRedOpponent()
        var white = this[' fight'].getWhiteOpponent()

        this[' fight'].on('reset', function (ms) {
            _send.call(this, ['fight', 'reset', ms])
        }.bind(this))
        this[' fight'].on('startPauseResume', function (ms) {
            _send.call(this, ['fight', 'startPauseResume', ms])
        }.bind(this))
        this[' fight'].on('stop', function (data) {
            _send.call(this, ['fight', 'stop', data[0], data[1], data[2]])
        }.bind(this))
        this[' fight'].on('toketa', function (ms) {
            _send.call(this, ['fight', 'toketa', ms])
        }.bind(this))
        this[' fight'].on('osaeKomi', function (side) {
            _send.call(this, ['fight', 'osaeKomi', side])
        }.bind(this))
        this[' fight'].on('removeCountUp', function () {
            _send.call(this, ['fight', 'removeCountUp'])
        }.bind(this))

        red.on('add', function (what) {
            _send.call(this, ['red', 'add'+what])
        }.bind(this)).on('remove', function (what) {
            _send.call(this, ['red', 'remove'+what])
        }.bind(this))

        white.on('add', function (what) {
            _send.call(this, ['white', 'add'+what])
        }.bind(this)).on('remove', function (what) {
            _send.call(this, ['white', 'remove'+what])
        }.bind(this))
    }

    /**
     * Registers an event-listener to this object
     *
     * @public
     * @method  FightEmitterLocal#on
     * @param   {String} type
     * @param   {Function} callback
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

    /**
     * Will be fired when peer connection was disconnected
     * @event FightEmitterLocal#disconnect
     */

    /**
     * Will be fired when peer connection has been established
     * @event FightEmitterLocal#establish
     */

    // Module-API
    return {
        /**
         * Creates an object to emit fight events to a receiver.
         *
         * @static
         * @method   create
         * @memberof "Direzione.FightEmitterLocal"
         * @param   {String} receiverID
         * @param   {Fight}  fight
         * @returns {FightEmitterLocal}
         */
        create: function (receiverID, fight) {
            return new FightEmitterLocal(receiverID, fight)
        }
    }
}))
