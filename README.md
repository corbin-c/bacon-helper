# BACON Utility

This utility is developed by Clément Corbin. It is designed to grab Kbart files
from the BAse de COnnaissance Nationale ([BACON](https://bacon.abes.fr/)),
created and maintained by the [ABES](http://www.abes.fr).

Disclaimer: The BACON data is released under CC0 licence. I don't own the data,
neither am I related to the ABES. This program is not developed neither
maintained by the ABES.

This BACON utility relies on the webservices provided by ABES. User
submits a list of IDs (ISSN & ISBN) and automatically retrieves the
associated [KBART](https://www.niso.org/standards-committees/kbart) data.

Additionnally, a little checkbox allows users to select [OpenEdition](https://www.openedition.org)
data in priority (if any) to support Open Science and easily gain access to free
content!

## Using the helper in another context

The JS module called in the web tool can be used for other purposes: it is a
simple BACON webservice wrapper for javascript.

It can be imported with:

```javascript
import { baconIdToKbart } from "https://corbin-c.github.io/bacon-helper/bacon.js"
```

Then, the baconIdToKbart() function is available. It takes two parameters: an
array of identifiers and a callback function for showing progress.
The function is async, it can be used this way:

```javascript
  let kbart = await baconIdToKbart(id_array,updateProgress);
```

The resulting kbart object contains two arrays, one being the errors (ie
identifiers which couldn't be resolved) the other being the kbart file lines.
The first line is always returned, even if there are no results. It's the usual
Kbart headers.
