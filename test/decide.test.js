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

describe('decide', function () {
  it('happy', () => {
    var d = new Decide()
    expect(d._patrun).exists()
  })
})
