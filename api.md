## Classes

<dl>
<dt><a href="#FightSettings">FightSettings</a> ℗</dt>
<dd></dd>
<dt><a href="#Fight">Fight</a> ℗</dt>
<dd></dd>
<dt><a href="#FightHistory">FightHistory</a> ℗</dt>
<dd></dd>
<dt><a href="#Opponent">Opponent</a> ℗</dt>
<dd></dd>
<dt><a href="#Person">Person</a> ℗</dt>
<dd></dd>
<dt><a href="#Playlist">Playlist</a> ℗</dt>
<dd></dd>
<dt><a href="#Entry">Entry</a> ℗</dt>
<dd></dd>
<dt><a href="#FightEmitter">FightEmitter</a> ℗</dt>
<dd></dd>
<dt><a href="#FightReceiver">FightReceiver</a> ℗</dt>
<dd></dd>
<dt><a href="#Repertoire">Repertoire</a> ℗</dt>
<dd></dd>
<dt><a href="#Scoreboard">Scoreboard</a> ℗</dt>
<dd></dd>
</dl>

## Objects

<dl>
<dt><a href="#Direzione.FightSettings">Direzione.FightSettings</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#Direzione.Fight">Direzione.Fight</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#Direzione.FightHistory">Direzione.FightHistory</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#Direzione.Opponent">Direzione.Opponent</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#Direzione.Person">Direzione.Person</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#Direzione.Playlist">Direzione.Playlist</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#Direzione">Direzione</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#Direzione.FightEmitter">Direzione.FightEmitter</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#Direzione.FightReceiver">Direzione.FightReceiver</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#Direzione.Utils">Direzione.Utils</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#Direzione.Repertoire">Direzione.Repertoire</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#Direzione.Scoreboard">Direzione.Scoreboard</a> : <code>object</code></dt>
<dd></dd>
</dl>

<a name="FightSettings"></a>

## FightSettings ℗
**Kind**: global class
**Access**: private

* [FightSettings](#FightSettings) ℗
    * [.toStorage()](#FightSettings+toStorage)
    * [.fromStorage()](#FightSettings+fromStorage)


* * *

<a name="FightSettings+toStorage"></a>

### fightSettings.toStorage()
Puts the settings to the local storage

**Kind**: instance method of [<code>FightSettings</code>](#FightSettings)
**Access**: public

* * *

<a name="FightSettings+fromStorage"></a>

### fightSettings.fromStorage()
Fetches the settings from the local storage and applies them to this object

**Kind**: instance method of [<code>FightSettings</code>](#FightSettings)
**Access**: public

* * *

<a name="Fight"></a>

## Fight ℗
**Kind**: global class
**Access**: private

* [Fight](#Fight) ℗
    * [new Fight(settings, whiteOpponent, redOpponent)](#new_Fight_new)
    * [.getHistory()](#Fight+getHistory) ⇒ [<code>FightHistory</code>](#FightHistory)
    * [.getCountDown()](#Fight+getCountDown) ⇒ <code>DurataSingleValue</code> \| <code>false</code>
    * [.getCountUp()](#Fight+getCountUp) ⇒ <code>DurataSingleValue</code> \| <code>false</code>
    * [.getWhiteOpponent()](#Fight+getWhiteOpponent) ⇒ [<code>Opponent</code>](#Opponent)
    * [.getRedOpponent()](#Fight+getRedOpponent) ⇒ [<code>Opponent</code>](#Opponent)
    * [.isStopped()](#Fight+isStopped) ⇒ <code>Boolean</code>
    * [.isRunning()](#Fight+isRunning) ⇒ <code>Boolean</code>
    * [.getTimeLeft()](#Fight+getTimeLeft) ⇒ <code>Integer</code> ℗
    * [.on(type, callback)](#Fight+on) ℗
    * [.clearListeners(externalOnly)](#Fight+clearListeners)
    * [.reset(forceMS)](#Fight+reset)
    * [.togglePauseResume()](#Fight+togglePauseResume) ℗
    * [.startPauseResume(forceMS)](#Fight+startPauseResume) ℗
    * [.osaeKomi(side, forceMS)](#Fight+osaeKomi) ℗
    * [.stop(msDownForce, msUpForce, side)](#Fight+stop) ℗
    * [.toketa(forceMS)](#Fight+toketa) ℗
    * ["reset"](#Fight+event_reset)
    * ["startPauseResume"](#Fight+event_startPauseResume)
    * ["osaeKomi"](#Fight+event_osaeKomi)
    * ["stop"](#Fight+event_stop)
    * ["toketa"](#Fight+event_toketa)
    * ["removeCountUp"](#Fight+event_removeCountUp)


* * *

<a name="new_Fight_new"></a>

### new Fight(settings, whiteOpponent, redOpponent)

| Param | Type |
| --- | --- |
| settings | [<code>FightSettings</code>](#FightSettings) |
| whiteOpponent | [<code>Opponent</code>](#Opponent) |
| redOpponent | [<code>Opponent</code>](#Opponent) |


* * *

<a name="Fight+getHistory"></a>

### fight.getHistory() ⇒ [<code>FightHistory</code>](#FightHistory)
Returns the object that holds the fight history

**Kind**: instance method of [<code>Fight</code>](#Fight)
**Access**: public

* * *

<a name="Fight+getCountDown"></a>

### fight.getCountDown() ⇒ <code>DurataSingleValue</code> \| <code>false</code>
Returns the object to process countdown

**Kind**: instance method of [<code>Fight</code>](#Fight)
**Access**: public

* * *

<a name="Fight+getCountUp"></a>

### fight.getCountUp() ⇒ <code>DurataSingleValue</code> \| <code>false</code>
Returns the object to process count up

**Kind**: instance method of [<code>Fight</code>](#Fight)
**Access**: public

* * *

<a name="Fight+getWhiteOpponent"></a>

### fight.getWhiteOpponent() ⇒ [<code>Opponent</code>](#Opponent)
Returns the object to manage the judika on white side

**Kind**: instance method of [<code>Fight</code>](#Fight)
**Access**: public

* * *

<a name="Fight+getRedOpponent"></a>

### fight.getRedOpponent() ⇒ [<code>Opponent</code>](#Opponent)
Returns the object to manage the judika on red side

**Kind**: instance method of [<code>Fight</code>](#Fight)
**Access**: public

* * *

<a name="Fight+isStopped"></a>

### fight.isStopped() ⇒ <code>Boolean</code>
Returns whether the fight is going on

**Kind**: instance method of [<code>Fight</code>](#Fight)
**Access**: public

* * *

<a name="Fight+isRunning"></a>

### fight.isRunning() ⇒ <code>Boolean</code>
Returns whether the fight is still going on

**Kind**: instance method of [<code>Fight</code>](#Fight)
**Access**: public

* * *

<a name="Fight+getTimeLeft"></a>

### fight.getTimeLeft() ⇒ <code>Integer</code> ℗
Returns remainig milliseconds until the fight ends

**Kind**: instance method of [<code>Fight</code>](#Fight)
**Access**: private

* * *

<a name="Fight+on"></a>

### fight.on(type, callback) ℗
Registers an event-listener to this object

**Kind**: instance method of [<code>Fight</code>](#Fight)
**Access**: private

| Param | Type |
| --- | --- |
| type | <code>String</code> |
| callback | <code>function</code> |


* * *

<a name="Fight+clearListeners"></a>

### fight.clearListeners(externalOnly)
Removes all listeners of this object

**Kind**: instance method of [<code>Fight</code>](#Fight)
**Access**: public

| Param | Type | Description |
| --- | --- | --- |
| externalOnly | <code>Boolean</code> | Default `true` |


* * *

<a name="Fight+reset"></a>

### fight.reset(forceMS)
Resets the fight (Time and score to initial values)

**Kind**: instance method of [<code>Fight</code>](#Fight)
**Emits**: [<code>reset</code>](#Fight+event_reset)
**Access**: public

| Param | Type | Description |
| --- | --- | --- |
| forceMS | <code>Integer</code> | Optional - If this is passed to the function, the countdown will be                            forced to this millisecond value |


* * *

<a name="Fight+togglePauseResume"></a>

### fight.togglePauseResume() ℗
Toggles pause and resume for the countdown

**Kind**: instance method of [<code>Fight</code>](#Fight)
**Access**: private

* * *

<a name="Fight+startPauseResume"></a>

### fight.startPauseResume(forceMS) ℗
Starts, pauses or resumes the fight

**Kind**: instance method of [<code>Fight</code>](#Fight)
**Emits**: [<code>startPauseResume</code>](#Fight+event_startPauseResume)
**Access**: private

| Param | Type | Description |
| --- | --- | --- |
| forceMS | <code>Integer</code> | Optional milliseconds the countdown should be forced to |


* * *

<a name="Fight+osaeKomi"></a>

### fight.osaeKomi(side, forceMS) ℗
Starts count up for osae komi

**Kind**: instance method of [<code>Fight</code>](#Fight)
**Emits**: [<code>osaeKomi</code>](#Fight+event_osaeKomi)
**Access**: private

| Param | Type | Description |
| --- | --- | --- |
| side | <code>String</code> | defines which opponent holds the other down ("red", "white" or "center") |
| forceMS | <code>Integer</code> | Milliseconds the count up should be forced to |


* * *

<a name="Fight+stop"></a>

### fight.stop(msDownForce, msUpForce, side) ℗
Stops the fight

**Kind**: instance method of [<code>Fight</code>](#Fight)
**Emits**: [<code>stop</code>](#Fight+event_stop)
**Access**: private

| Param | Type | Description |
| --- | --- | --- |
| msDownForce | <code>Integer</code> | Optional milliseconds the countdown should be forced to |
| msUpForce | <code>Integer</code> | Optional milliseconds the count up should be forced to |
| side | <code>String</code> | defines which opponent holds the other down ("red", "white" or "center") |


* * *

<a name="Fight+toketa"></a>

### fight.toketa(forceMS) ℗
Pauses the count up for osae komi

**Kind**: instance method of [<code>Fight</code>](#Fight)
**Access**: private

| Param | Type | Description |
| --- | --- | --- |
| forceMS | <code>Integer</code> | Optional milliseconds the count up should be forced to |


* * *

<a name="Fight+event_reset"></a>

### "reset"
Will be fired when the score and time of a fight has been reset

**Kind**: event emitted by [<code>Fight</code>](#Fight)

* * *

<a name="Fight+event_startPauseResume"></a>

### "startPauseResume"
Will be fired when countdown has been started, paused or resumed

**Kind**: event emitted by [<code>Fight</code>](#Fight)

* * *

<a name="Fight+event_osaeKomi"></a>

### "osaeKomi"
Will be fired when count up has been started

**Kind**: event emitted by [<code>Fight</code>](#Fight)

* * *

<a name="Fight+event_stop"></a>

### "stop"
Will be fired when the countdown has been stopped (fight ended)

**Kind**: event emitted by [<code>Fight</code>](#Fight)

* * *

<a name="Fight+event_toketa"></a>

### "toketa"
Will be fired when count up has been stopped

**Kind**: event emitted by [<code>Fight</code>](#Fight)

* * *

<a name="Fight+event_removeCountUp"></a>

### "removeCountUp"
Will be fired when count up has been removed

**Kind**: event emitted by [<code>Fight</code>](#Fight)

* * *

<a name="FightHistory"></a>

## FightHistory ℗
**Kind**: global class
**Access**: private

* * *

<a name="new_FightHistory_new"></a>

### new FightHistory(fight)

| Param | Type |
| --- | --- |
| fight | [<code>Fight</code>](#Fight) |


* * *

<a name="Opponent"></a>

## Opponent ℗
**Kind**: global class
**Access**: private

* [Opponent](#Opponent) ℗
    * [new Opponent(person, score, penalty)](#new_Opponent_new)
    * [.on(type, callback)](#Opponent+on)
    * [.clearListeners()](#Opponent+clearListeners)
    * [.getClubName()](#Opponent+getClubName) ⇒ <code>String</code>
    * [.getFullName()](#Opponent+getFullName) ⇒ <code>String</code>
    * [.getScore()](#Opponent+getScore) ⇒ <code>Integer</code>
    * [.getShido()](#Opponent+getShido) ⇒ <code>Integer</code>
    * [.addIppon()](#Opponent+addIppon)
    * [.addShido()](#Opponent+addShido)
    * [.addWazari()](#Opponent+addWazari)
    * [.removeIppon()](#Opponent+removeIppon)
    * [.removeShido()](#Opponent+removeShido)
    * [.removeWazari()](#Opponent+removeWazari)
    * [.reset()](#Opponent+reset)
    * ["add"](#Opponent+event_add)
    * ["remove"](#Opponent+event_remove)
    * ["reset"](#Opponent+event_reset)


* * *

<a name="new_Opponent_new"></a>

### new Opponent(person, score, penalty)

| Param | Type |
| --- | --- |
| person | [<code>Person</code>](#Person) |
| score | <code>Integer</code> |
| penalty | <code>Integer</code> |


* * *

<a name="Opponent+on"></a>

### opponent.on(type, callback)
Registers an event-listener to this object

**Kind**: instance method of [<code>Opponent</code>](#Opponent)
**Access**: public

| Param | Type |
| --- | --- |
| type | <code>String</code> |
| callback | <code>function</code> |


* * *

<a name="Opponent+clearListeners"></a>

### opponent.clearListeners()
Removes all listerners of this object

**Kind**: instance method of [<code>Opponent</code>](#Opponent)
**Access**: public

* * *

<a name="Opponent+getClubName"></a>

### opponent.getClubName() ⇒ <code>String</code>
Returns the name of the club, where the opponent is member of

**Kind**: instance method of [<code>Opponent</code>](#Opponent)
**Access**: public

* * *

<a name="Opponent+getFullName"></a>

### opponent.getFullName() ⇒ <code>String</code>
Returns the firstname and lastname of the opponent

**Kind**: instance method of [<code>Opponent</code>](#Opponent)
**Access**: public

* * *

<a name="Opponent+getScore"></a>

### opponent.getScore() ⇒ <code>Integer</code>
Returns the score of the opponent

**Kind**: instance method of [<code>Opponent</code>](#Opponent)
**Access**: public

* * *

<a name="Opponent+getShido"></a>

### opponent.getShido() ⇒ <code>Integer</code>
Returns the penalty score of the opponent

**Kind**: instance method of [<code>Opponent</code>](#Opponent)
**Access**: public

* * *

<a name="Opponent+addIppon"></a>

### opponent.addIppon()
Adds amount of points for ippon to score of the opponent

**Kind**: instance method of [<code>Opponent</code>](#Opponent)
**Emits**: [<code>add</code>](#Opponent+event_add)
**Access**: public

* * *

<a name="Opponent+addShido"></a>

### opponent.addShido()
Adds a penalty point to the penalty score of the opponent

**Kind**: instance method of [<code>Opponent</code>](#Opponent)
**Emits**: [<code>add</code>](#Opponent+event_add)
**Access**: public

* * *

<a name="Opponent+addWazari"></a>

### opponent.addWazari()
Adds amount of points for wazari to score of the opponent

**Kind**: instance method of [<code>Opponent</code>](#Opponent)
**Emits**: [<code>add</code>](#Opponent+event_add)
**Access**: public

* * *

<a name="Opponent+removeIppon"></a>

### opponent.removeIppon()
Removes amount of points for ippon from score of the opponent

**Kind**: instance method of [<code>Opponent</code>](#Opponent)
**Emits**: [<code>remove</code>](#Opponent+event_remove)
**Access**: public

* * *

<a name="Opponent+removeShido"></a>

### opponent.removeShido()
Removes a penalty point from the penalty score of the opponent

**Kind**: instance method of [<code>Opponent</code>](#Opponent)
**Emits**: [<code>remove</code>](#Opponent+event_remove)
**Access**: public

* * *

<a name="Opponent+removeWazari"></a>

### opponent.removeWazari()
Removes amount of points for wazari from score of the opponent

**Kind**: instance method of [<code>Opponent</code>](#Opponent)
**Emits**: [<code>remove</code>](#Opponent+event_remove)
**Access**: public

* * *

<a name="Opponent+reset"></a>

### opponent.reset()
Resets the score and penalty of the opponent

**Kind**: instance method of [<code>Opponent</code>](#Opponent)
**Emits**: [<code>reset</code>](#Opponent+event_reset)
**Access**: public

* * *

<a name="Opponent+event_add"></a>

### "add"
Will be fired when score has been changed, when added

**Kind**: event emitted by [<code>Opponent</code>](#Opponent)

* * *

<a name="Opponent+event_remove"></a>

### "remove"
Will be fired when score has been changed, when removed

**Kind**: event emitted by [<code>Opponent</code>](#Opponent)

* * *

<a name="Opponent+event_reset"></a>

### "reset"
Will be fired when score has been reset

**Kind**: event emitted by [<code>Opponent</code>](#Opponent)

* * *

<a name="Person"></a>

## Person ℗
**Kind**: global class
**Access**: private

* [Person](#Person) ℗
    * [new Person(firstName, lastName, club)](#new_Person_new)
    * [.getClubName()](#Person+getClubName) ⇒ <code>String</code>
    * [.getFirstName()](#Person+getFirstName) ⇒ <code>String</code>
    * [.getLastName()](#Person+getLastName) ⇒ <code>String</code>
    * [.getLockOut(ms)](#Person+getLockOut)
    * [.getLockOut()](#Person+getLockOut) ⇒ <code>false</code> \| <code>Durata</code>
    * [.reset()](#Person+reset)


* * *

<a name="new_Person_new"></a>

### new Person(firstName, lastName, club)

| Param | Type |
| --- | --- |
| firstName | <code>String</code> |
| lastName | <code>String</code> |
| club | <code>String</code> |


* * *

<a name="Person+getClubName"></a>

### person.getClubName() ⇒ <code>String</code>
Returns the name of the club, where the Person is member of

**Kind**: instance method of [<code>Person</code>](#Person)
**Access**: public

* * *

<a name="Person+getFirstName"></a>

### person.getFirstName() ⇒ <code>String</code>
Returns the firstname of the Person

**Kind**: instance method of [<code>Person</code>](#Person)
**Access**: public

* * *

<a name="Person+getLastName"></a>

### person.getLastName() ⇒ <code>String</code>
Returns the lastname of the Person

**Kind**: instance method of [<code>Person</code>](#Person)
**Access**: public

* * *

<a name="Person+getLockOut"></a>

### person.getLockOut(ms)
Sets persons lock-out time in milliseconds

**Kind**: instance method of [<code>Person</code>](#Person)
**Access**: public

| Param | Type |
| --- | --- |
| ms | <code>Integer</code> |


* * *

<a name="Person+getLockOut"></a>

### person.getLockOut() ⇒ <code>false</code> \| <code>Durata</code>
Returns the lock-out, if set

**Kind**: instance method of [<code>Person</code>](#Person)
**Access**: public

* * *

<a name="Person+reset"></a>

### person.reset()
Resets the lock-out

**Kind**: instance method of [<code>Person</code>](#Person)
**Access**: public

* * *

<a name="Playlist"></a>

## Playlist ℗
**Kind**: global class
**Access**: private

* [Playlist](#Playlist) ℗
    * [new Playlist()](#new_Playlist_new)
    * [.insert(fight)](#Playlist+insert) ⇒ <code>int</code>
    * [.find(callback, [fromIndex])](#Playlist+find) ⇒ [<code>Fight</code>](#Fight) \| <code>undefined</code>
    * [.includes(searchElement, [fromIndex])](#Playlist+includes) ⇒ <code>Boolean</code>
    * [.remove(fight, [fromIndex])](#Playlist+remove) ⇒ [<code>Fight</code>](#Fight)
    * [.next()](#Playlist+next) ⇒ [<code>Fight</code>](#Fight)
    * [.prev()](#Playlist+prev) ⇒ [<code>Fight</code>](#Fight)
    * [.reset()](#Playlist+reset) ⇒ [<code>Playlist</code>](#Playlist)


* * *

<a name="new_Playlist_new"></a>

### new Playlist()
Class to manage a list of fights as playlist


* * *

<a name="Playlist+insert"></a>

### playlist.insert(fight) ⇒ <code>int</code>
Adds a fight object right after the cursor node of the playlist and returns
the new length of the list

**Kind**: instance method of [<code>Playlist</code>](#Playlist)
**Returns**: <code>int</code> - - The new length of the list
**Access**: public

| Param | Type |
| --- | --- |
| fight | [<code>Fight</code>](#Fight) |


* * *

<a name="Playlist+find"></a>

### playlist.find(callback, [fromIndex]) ⇒ [<code>Fight</code>](#Fight) \| <code>undefined</code>
Returns the value of the first fight-element in the list that satisfies
the provided testing function. Otherwise undefined is returned

**Kind**: instance method of [<code>Playlist</code>](#Playlist)
**Returns**: [<code>Fight</code>](#Fight) \| <code>undefined</code> - - A value in the list if a fight-element passes the test; otherwise, undefined
**Access**: public

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| callback | <code>function</code> |  | Function to test for each fight-element |
| [fromIndex] | <code>int</code> | <code>0</code> | The position in this list at which to begin searching for searchElement |


* * *

<a name="Playlist+includes"></a>

### playlist.includes(searchElement, [fromIndex]) ⇒ <code>Boolean</code>
Determines whether a list includes a certain fight-element,
returning true or false as appropriate

**Kind**: instance method of [<code>Playlist</code>](#Playlist)
**Returns**: <code>Boolean</code> - - true if the searchElement found in the list; otherwise, false
**Access**: public

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| searchElement | [<code>Fight</code>](#Fight) |  | The fight-element to search for |
| [fromIndex] | <code>int</code> | <code>0</code> | The position in this list at which to begin searching for searchElement |


* * *

<a name="Playlist+remove"></a>

### playlist.remove(fight, [fromIndex]) ⇒ [<code>Fight</code>](#Fight)
Removes a fight-element from the list

**Kind**: instance method of [<code>Playlist</code>](#Playlist)
**Returns**: [<code>Fight</code>](#Fight) - - Returns removed fight-element if found, undefined otherwise
**Access**: public

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fight | [<code>Fight</code>](#Fight) |  | The fight-element to be removed from playlist |
| [fromIndex] | <code>int</code> | <code>0</code> | The position in this list at which to begin searching for the fight-element |


* * *

<a name="Playlist+next"></a>

### playlist.next() ⇒ [<code>Fight</code>](#Fight)
Moves cursor to the next entry and returns the fight-object in it

**Kind**: instance method of [<code>Playlist</code>](#Playlist)
**Returns**: [<code>Fight</code>](#Fight) - - Returns fight-object of next node to the cursor. If cursor reaches to the end, it returns undefined
**Access**: public

* * *

<a name="Playlist+prev"></a>

### playlist.prev() ⇒ [<code>Fight</code>](#Fight)
Moves cursor to the previous entry and returns the fight-object in it

**Kind**: instance method of [<code>Playlist</code>](#Playlist)
**Returns**: [<code>Fight</code>](#Fight) - - Returns fight-object of previous node to the cursor. If cursor reaches to the head, it returns undefined
**Access**: public

* * *

<a name="Playlist+reset"></a>

### playlist.reset() ⇒ [<code>Playlist</code>](#Playlist)
Resets cursor to head

**Kind**: instance method of [<code>Playlist</code>](#Playlist)
**Returns**: [<code>Playlist</code>](#Playlist) - - Returns the Playlist instance which this method is called
**Access**: public

* * *

<a name="Entry"></a>

## Entry ℗
**Kind**: global class
**Access**: private

* * *

<a name="new_Entry_new"></a>

### new Entry(list, fight)
Class to manage the entries in the playlist


| Param | Type |
| --- | --- |
| list | [<code>Playlist</code>](#Playlist) |
| fight | [<code>Fight</code>](#Fight) |


* * *

<a name="FightEmitter"></a>

## FightEmitter ℗
**Kind**: global class
**Access**: private

* [FightEmitter](#FightEmitter) ℗
    * [new FightEmitter(receiverID, fight, servers)](#new_FightEmitter_new)
    * [.isConnected()](#FightEmitter+isConnected) ⇒ <code>Boolean</code>
    * [.getFight()](#FightEmitter+getFight)
    * [.replaceFight()](#FightEmitter+replaceFight)
    * [.disconnect()](#FightEmitter+disconnect)
    * [.connect()](#FightEmitter+connect) ⇒ <code>Promise</code>
    * [.on(type, callback)](#FightEmitter+on)
    * [.on(type, callback)](#FightEmitter+on)
    * ["disconnect"](#FightEmitter+event_disconnect)
    * ["establish"](#FightEmitter+event_establish)


* * *

<a name="new_FightEmitter_new"></a>

### new FightEmitter(receiverID, fight, servers)

| Param | Type |
| --- | --- |
| receiverID | <code>String</code> |
| fight | [<code>Fight</code>](#Fight) |
| servers | <code>Array</code> |


* * *

<a name="FightEmitter+isConnected"></a>

### fightEmitter.isConnected() ⇒ <code>Boolean</code>
Returns whether the connection to a FightReceiver is established

**Kind**: instance method of [<code>FightEmitter</code>](#FightEmitter)
**Access**: public

* * *

<a name="FightEmitter+getFight"></a>

### fightEmitter.getFight()
Returns the fight

**Kind**: instance method of [<code>FightEmitter</code>](#FightEmitter)
**Access**: public

* * *

<a name="FightEmitter+replaceFight"></a>

### fightEmitter.replaceFight()
Replaces the fight of this emitter and emits the new object

**Kind**: instance method of [<code>FightEmitter</code>](#FightEmitter)
**Access**: public

* * *

<a name="FightEmitter+disconnect"></a>

### fightEmitter.disconnect()
Trys to disconnect from the connected FightReceiver

**Kind**: instance method of [<code>FightEmitter</code>](#FightEmitter)
**Access**: public

* * *

<a name="FightEmitter+connect"></a>

### fightEmitter.connect() ⇒ <code>Promise</code>
Trys to connect to a FightReceiver with given ID

**Kind**: instance method of [<code>FightEmitter</code>](#FightEmitter)
**Emits**: [<code>establish</code>](#FightEmitter+event_establish), [<code>disconnect</code>](#FightEmitter+event_disconnect)
**Access**: public

* * *

<a name="FightEmitter+on"></a>

### fightEmitter.on(type, callback)
Registers an event-listener to this object

**Kind**: instance method of [<code>FightEmitter</code>](#FightEmitter)
**Access**: public

| Param | Type |
| --- | --- |
| type | <code>String</code> |
| callback | <code>function</code> |


* * *

<a name="FightEmitter+on"></a>

### fightEmitter.on(type, callback)
Registers an event-listener to this object

**Kind**: instance method of [<code>FightEmitter</code>](#FightEmitter)
**Access**: public

| Param | Type |
| --- | --- |
| type | <code>String</code> |
| callback | <code>function</code> |


* * *

<a name="FightEmitter+event_disconnect"></a>

### "disconnect"
Will be fired when peer connection was disconnected

**Kind**: event emitted by [<code>FightEmitter</code>](#FightEmitter)

* * *

<a name="FightEmitter+event_establish"></a>

### "establish"
Will be fired when peer connection has been established

**Kind**: event emitted by [<code>FightEmitter</code>](#FightEmitter)

* * *

<a name="FightReceiver"></a>

## FightReceiver ℗
**Kind**: global class
**Access**: private

* [FightReceiver](#FightReceiver) ℗
    * [new FightReceiver(receiverID, viewConfig, servers)](#new_FightReceiver_new)
    * [.isConnected()](#FightReceiver+isConnected) ⇒ <code>Boolean</code>
    * ["disconnect"](#FightReceiver+event_disconnect)
    * ["establish"](#FightReceiver+event_establish)


* * *

<a name="new_FightReceiver_new"></a>

### new FightReceiver(receiverID, viewConfig, servers)

| Param | Type |
| --- | --- |
| receiverID | <code>String</code> |
| viewConfig | <code>Object</code> |
| servers | <code>Array</code> |


* * *

<a name="FightReceiver+isConnected"></a>

### fightReceiver.isConnected() ⇒ <code>Boolean</code>
Returns whether the connection to a FightReceiver is established

**Kind**: instance method of [<code>FightReceiver</code>](#FightReceiver)
**Access**: public

* * *

<a name="FightReceiver+event_disconnect"></a>

### "disconnect"
Will be fired when peer connection was disconnected

**Kind**: event emitted by [<code>FightReceiver</code>](#FightReceiver)

* * *

<a name="FightReceiver+event_establish"></a>

### "establish"
Will be fired when peer connection has been established

**Kind**: event emitted by [<code>FightReceiver</code>](#FightReceiver)

* * *

<a name="Repertoire"></a>

## Repertoire ℗
**Kind**: global class
**Access**: private

* * *

<a name="new_Repertoire_new"></a>

### new Repertoire(playlistModel, viewConfig)

| Param | Type |
| --- | --- |
| playlistModel | [<code>Playlist</code>](#Playlist) |
| viewConfig | <code>Object</code> |


* * *

<a name="Scoreboard"></a>

## Scoreboard ℗
**Kind**: global class
**Access**: private

* [Scoreboard](#Scoreboard) ℗
    * [new Scoreboard(fightModel, viewConfig)](#new_Scoreboard_new)
    * [.run()](#Scoreboard+run)
    * [.stop()](#Scoreboard+stop)
    * [.replaceFight()](#Scoreboard+replaceFight)
    * [.showNames()](#Scoreboard+showNames)
    * [.hideNames()](#Scoreboard+hideNames)
    * [.shutdown()](#Scoreboard+shutdown)


* * *

<a name="new_Scoreboard_new"></a>

### new Scoreboard(fightModel, viewConfig)

| Param | Type |
| --- | --- |
| fightModel | [<code>Fight</code>](#Fight) |
| viewConfig | <code>Object</code> |


* * *

<a name="Scoreboard+run"></a>

### scoreboard.run()
Starts the update process for the display

**Kind**: instance method of [<code>Scoreboard</code>](#Scoreboard)
**Access**: public

* * *

<a name="Scoreboard+stop"></a>

### scoreboard.stop()
Stops the update process for the display

**Kind**: instance method of [<code>Scoreboard</code>](#Scoreboard)
**Access**: public

* * *

<a name="Scoreboard+replaceFight"></a>

### scoreboard.replaceFight()
Replaces the present fight

**Kind**: instance method of [<code>Scoreboard</code>](#Scoreboard)
**Access**: public

* * *

<a name="Scoreboard+showNames"></a>

### scoreboard.showNames()
Displays Names of opponents

**Kind**: instance method of [<code>Scoreboard</code>](#Scoreboard)
**Access**: public

* * *

<a name="Scoreboard+hideNames"></a>

### scoreboard.hideNames()
Hides Names of opponents

**Kind**: instance method of [<code>Scoreboard</code>](#Scoreboard)
**Access**: public

* * *

<a name="Scoreboard+shutdown"></a>

### scoreboard.shutdown()
Shuts the scoreboard display down

**Kind**: instance method of [<code>Scoreboard</code>](#Scoreboard)
**Access**: public

* * *

<a name="Direzione.FightSettings"></a>

## Direzione.FightSettings : <code>object</code>
**Kind**: global namespace

* * *

<a name="Direzione.FightSettings.create"></a>

### Direzione.FightSettings.create() ⇒ [<code>FightSettings</code>](#FightSettings)
Creates an object to manage settings to a fight

**Kind**: static method of [<code>Direzione.FightSettings</code>](#Direzione.FightSettings)

* * *

<a name="Direzione.Fight"></a>

## Direzione.Fight : <code>object</code>
**Kind**: global namespace

* * *

<a name="Direzione.Fight.create"></a>

### Direzione.Fight.create(settings, thousandsSeparator, decimalCount) ⇒ [<code>Fight</code>](#Fight)
Creates an object to manage a fight.

**Kind**: static method of [<code>Direzione.Fight</code>](#Direzione.Fight)

| Param | Type |
| --- | --- |
| settings | [<code>FightSettings</code>](#FightSettings) |
| thousandsSeparator | [<code>Opponent</code>](#Opponent) |
| decimalCount | [<code>Opponent</code>](#Opponent) |


* * *

<a name="Direzione.FightHistory"></a>

## Direzione.FightHistory : <code>object</code>
**Kind**: global namespace

* * *

<a name="Direzione.FightHistory.create"></a>

### Direzione.FightHistory.create(fight) ⇒ [<code>FightHistory</code>](#FightHistory)
Creates an object to manage a the history of a fight.

**Kind**: static method of [<code>Direzione.FightHistory</code>](#Direzione.FightHistory)

| Param | Type |
| --- | --- |
| fight | [<code>Fight</code>](#Fight) |


* * *

<a name="Direzione.Opponent"></a>

## Direzione.Opponent : <code>object</code>
**Kind**: global namespace

* * *

<a name="Direzione.Opponent.create"></a>

### Direzione.Opponent.create(person, score, penalty) ⇒ [<code>Opponent</code>](#Opponent)
Creates an object to manage a opponent (in a fight).

**Kind**: static method of [<code>Direzione.Opponent</code>](#Direzione.Opponent)

| Param | Type |
| --- | --- |
| person | [<code>Person</code>](#Person) |
| score | <code>Integer</code> |
| penalty | <code>Integer</code> |


* * *

<a name="Direzione.Person"></a>

## Direzione.Person : <code>object</code>
**Kind**: global namespace

* * *

<a name="Direzione.Person.create"></a>

### Direzione.Person.create(firstName, lastName, club) ⇒ [<code>Person</code>](#Person)
Creates an object to manage a fight.

**Kind**: static method of [<code>Direzione.Person</code>](#Direzione.Person)

| Param | Type |
| --- | --- |
| firstName | <code>String</code> |
| lastName | <code>String</code> |
| club | <code>String</code> |


* * *

<a name="Direzione.Playlist"></a>

## Direzione.Playlist : <code>object</code>
**Kind**: global namespace

* * *

<a name="Direzione.Playlist.create"></a>

### Direzione.Playlist.create() ⇒ [<code>Playlist</code>](#Playlist)
Creates an object of a double linked list holding fights and acts as playlist.

**Kind**: static method of [<code>Direzione.Playlist</code>](#Direzione.Playlist)

* * *

<a name="Direzione"></a>

## Direzione : <code>object</code>
**Kind**: global namespace

* * *

<a name="Direzione.FightEmitter"></a>

## Direzione.FightEmitter : <code>object</code>
**Kind**: global namespace

* * *

<a name="Direzione.FightEmitter.create"></a>

### Direzione.FightEmitter.create(receiverID, fight) ⇒ [<code>FightEmitter</code>](#FightEmitter)
Creates an object to emit fight events to a receiver.

**Kind**: static method of [<code>Direzione.FightEmitter</code>](#Direzione.FightEmitter)

| Param | Type |
| --- | --- |
| receiverID | <code>String</code> |
| fight | [<code>Fight</code>](#Fight) |


* * *

<a name="Direzione.FightReceiver"></a>

## Direzione.FightReceiver : <code>object</code>
**Kind**: global namespace

* * *

<a name="Direzione.FightReceiver.create"></a>

### Direzione.FightReceiver.create(receiverID, viewConfig) ⇒ [<code>FightReceiver</code>](#FightReceiver)
Creates an object to receive scoreboard events from a emitter scoreboard.

**Kind**: static method of [<code>Direzione.FightReceiver</code>](#Direzione.FightReceiver)

| Param | Type |
| --- | --- |
| receiverID | <code>String</code> |
| viewConfig | <code>Object</code> |


* * *

<a name="Direzione.Utils"></a>

## Direzione.Utils : <code>object</code>
**Kind**: global namespace

* * *

<a name="Direzione.Utils.loadTranslationJS"></a>

### Direzione.Utils.loadTranslationJS(path, callback) ⇒ <code>String</code>
Loads a JS-file from a given path and passes the so (hopefully) loaded
member variable "Direzione.translation" to the given callback-function

**Kind**: static method of [<code>Direzione.Utils</code>](#Direzione.Utils)
**Access**: public

| Param | Type |
| --- | --- |
| path | <code>String</code> |
| callback | <code>function</code> |


* * *

<a name="Direzione.Repertoire"></a>

## Direzione.Repertoire : <code>object</code>
**Kind**: global namespace

* * *

<a name="Direzione.Repertoire.create"></a>

### Direzione.Repertoire.create(playlistModel, viewConfig) ⇒ [<code>Repertoire</code>](#Repertoire)
Creates an object to update a scoreboard.

**Kind**: static method of [<code>Direzione.Repertoire</code>](#Direzione.Repertoire)

| Param | Type |
| --- | --- |
| playlistModel | [<code>Playlist</code>](#Playlist) |
| viewConfig | <code>Object</code> |


* * *

<a name="Direzione.Scoreboard"></a>

## Direzione.Scoreboard : <code>object</code>
**Kind**: global namespace

* * *

<a name="Direzione.Scoreboard.create"></a>

### Direzione.Scoreboard.create(fightModel, viewConfig) ⇒ [<code>Scoreboard</code>](#Scoreboard)
Creates an object to update a scoreboard.

**Kind**: static method of [<code>Direzione.Scoreboard</code>](#Direzione.Scoreboard)

| Param | Type |
| --- | --- |
| fightModel | [<code>Fight</code>](#Fight) |
| viewConfig | <code>Object</code> |


* * *

