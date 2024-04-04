
const OpponentGroup = require('../../src/model/OpponentGroup')
const Person = require('../../src/model/Person')

describe('model/OpponentGroup.js', () => {
    it('Create group and add members', () => {
        var og = OpponentGroup.create('Dizzy')

        og.addPerson(Person.create())
        og.addPerson(Person.create())

        expect(og.getName()).toEqual('Dizzy')
        expect(og.getPersons().length).toEqual(2)
    })


    it('Create group and add and remove members', () => {
        var toRemove
        var og = OpponentGroup.create('Dizzy')

        og.addPerson(Person.create())
        og.addPerson(Person.create())
        expect(og.getPersons().length).toEqual(2)
        og.addPerson(toRemove = Person.create())
        og.addPerson(Person.create())
        expect(og.getPersons().length).toEqual(4)

        og.removePerson(toRemove)
        expect(og.getPersons().length).toEqual(3)
    })
})
