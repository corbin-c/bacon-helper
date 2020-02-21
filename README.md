# BACON Utility

This utility is developed by Clément Corbin. It is basically a link solver based
on BACON:

This tool is designed to grab [KBART](https://www.niso.org/standards-committees/kbart) 
data from the BAse de COnnaissance Nationale ([BACON](https://bacon.abes.fr/)),
created and maintained by the [ABES](http://www.abes.fr). The user is aked for
an ID (ISSN, ISBN) and gets redirected to the resource URL, extracted from
BACON. Free access is served first.

This tool relies on the great [webservices provided by the ABES](http://documentation.abes.fr/aidebacon/index.html#ManuelBacon_1).

Disclaimer: The BACON data is released under CC0 licence. I don't own it,
neither am I related to the ABES. This program is not developed neither
maintained by the ABES.

**/!\ If various sources are found for an ID, the helper will prioritize the one
offering Open Access (ie F access type)**

## Using the helper in another context

The JS module called in the web tool can be used for other purposes: it is a
simple BACON webservice wrapper for javascript, shipped in an ES module.

It can be imported with:

```javascript
import { baconIdToKbart } from "https://corbin-c.github.io/bacon-helper/bacon.js"
```

Then, the baconIdToKbart() async function is available. It takes two parameters:
an array of identifiers (mandatory) and a callback function for monitoring
progress.

```javascript
  let kbart = await baconIdToKbart(id_array,[updateProgress]);
```

The resulting kbart object contains two arrays, one being the errors (ie
identifiers which couldn't be resolved) the other being the kbart file lines.
The first line is always returned, even if there are no results. It's the usual
Kbart headers.
