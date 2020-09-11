/* Copyright (c) 2020 Richard Rodger, MIT License */

const Patrun = require('patrun')

class Decide {
  constructor(opts) {
    this._patrun = {}
  }

  decide(name,cond) {
    return this._patrun[name].find(cond)
  }
  
  table(ts) {
    let table_spec = ts

    if('string' === typeof(ts)) {
      table_spec = this.parse(ts)
    }
    else if(Array.isArray(ts)) {
      // TODO: table_spec = this.array(ts)
    }

    let p = this._patrun[table_spec.n] = new Patrun({gex: true})

    table_spec.t.forEach(c=>{
      p.add(c.c,c.r)
    })
  }

  parse(tstr) {
    let ts = {t:[],f:{}}

    let m = null
    let lines = tstr
        .split(/[\n\r]/)
        .map(n=>(m=n.match(/^([^#]+)/),m&&m[1]||''))
        .filter(n=>
                n!='' &&
                !n.match(/^\s+$/) &&
                !n.match(/^\s*#/) &&
                !n.match(/^=+$/)
               )

    //console.log('lines',lines)

    let i = 0
    let line = lines[0]
    
    // >name
    ts.n = line.match(/^\w+/)[0]
    line = lines[++i]
    
    // >field = value[, value]
    while(m = line.match(/^(\w+)\s*=\s*(.*)$/)) {
      let field_name = m[1]
      let field_spec = {
        v: m[2].split(/\s*(,|\s+)\s*/).filter(n=>''!=n&&','!=n&&!n.match(/^\s+$/))
      }
      ts.f[field_name] = field_spec
      line = lines[++i]
    }
    
    // >in_field[ in_field] => out_field[ out_field]
    m = line.split(/\s*=>\s*/)
    ts.c = m[0].split(/\s+/)
    ts.r = m[1].split(/\s+/)
    line = lines[++i]
    
    while(line && (m = line.split(/\s*=>\s*/))) {
      let tr = {}
      let cond = m[0].split(/\s+/)
      let res = m[1].split(/\s+/)

      tr.c = ts.c.reduce((o,cf,i)=>(o[cf]=cond[i],o),{})
      tr.r = ts.r.reduce((o,rf,i)=>(o[rf]=res[i],o),{})
      
      ts.t.push(tr)
      
      line = lines[++i]
    }

    return ts
  }
  
}

module.exports = Decide
