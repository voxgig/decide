/* Copyright (c) 2020 Richard Rodger, MIT License */
'use strict'

var Lab = require('@hapi/lab')
Lab = null != Lab.script ? Lab : require('hapi-lab-shim')

var Code = require('@hapi/code')

var lab = (exports.lab = Lab.script())
var describe = lab.describe
var it = lab.it
var expect = Code.expect

var Decide = require('..')

var t01 = `
# a comment
coffee:

when    = morning, afternoon
weather = sun, rain
where   = cafe, vend, none
how     = drive walk sit      # end line comment, commas optional

when       weather  =>  where  how
====================================
morning    sun      =>  cafe   drive
morning    rain     =>  vend   walk
afternoon  *        =>  none   sit    # any weather
`

describe('decide', function () {
  it('happy', () => {
    var d = new Decide()

    d.table(t01)
    // console.log(d._patrun.coffee.list())

    expect(d.decide('coffee', { when: 'morning', weather: 'sun' })).equal({
      where: 'cafe',
      how: 'drive',
    })
    expect(d.decide('coffee', { when: 'morning', weather: 'rain' })).equal({
      where: 'vend',
      how: 'walk',
    })
    expect(d.decide('coffee', { when: 'afternoon', weather: 'sun' })).equal({
      where: 'none',
      how: 'sit',
    })
    expect(d.decide('coffee', { when: 'afternoon', weather: 'rain' })).equal({
      where: 'none',
      how: 'sit',
    })
  })

  it('parse', () => {
    var d = new Decide()
    var ts = d.parse(t01)
    expect(ts.n).equal('coffee')
    // console.dir(ts,{depth:null})
  })
})
