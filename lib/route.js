/**
 * This module defines a custom jsDoc tag.
 * It allows you to document header parameters of a route.
 * @module lib/headerparam
 */

'use strict'

var join = require('path').join
var fs = require('fs')
var Prism = require('prismjs')

exports.name = 'path'
exports.options = {
  mustHaveValue: true,
  mustNotHaveDescription: true,
  canHaveType: true,
  canHaveName: true,
  onTagged: function (doclet, tag) {
    doclet.route = {
      'name': tag.value.name,
      'type': tag.value.type ? (tag.value.type.names.length === 1 ? tag.value.type.names[0] : tag.value.type.names) : ''
    }
  }
}
exports.newDocletHandler = function (e) {
  var route = e.doclet.route
  if (route) {
		e.doclet.description = `<h5>Route:</h5>
                            <table class="params">
                            <thead><tr><th>Method</th><th class="last">Path</th></tr></thead>
                            <tr>
                            <td class="type">${route.type}</td>
                            <td class="name last">${route.name}</td>
                            </tr>
                            </table>
														${e.doclet.description || ''}`

		// Add schema to end of description
		var file = fs.readFileSync(join(e.doclet.meta.path, e.doclet.meta.filename), 'utf8', err => {
			if (err) {
				console.error(err);
			}
		});

		var match = /(?:export const schema = )([\s\S]*)(?:;\n\nexport const route)/.exec(file);
		if (match) {
			var schema = match[1].trim();
			e.doclet.description = `
				${e.doclet.description}
				<h5>Schema:</h5>
				<pre class="language-javascript"><code class="language-javascript">${Prism.highlight(schema, Prism.languages.javascript, 'javascript')}</code></pre>
			`
		}

    e.doclet.scope = 'route'
  }
}

