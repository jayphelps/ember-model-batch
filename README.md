ember-model-batch
=================

Automatically batch multiple model requests, that happen within the same execution stack, into a single ajax call using the `Ember.AdapterBatchMixin` with your API adapter. (Usually `DS.RESTAdapter` or `Ember.RESTAdapter`)

Basically, if multiple models are synced at the same time, instead of making an ajax request for each one, make a single batch call. *This all assumes you have such ability within your API.*

### Ember Data Example
```javascript
App.ApplicationAdapter = DS.RESTAdapter.extend(Ember.AdapterBatchMixin, {
	namespace: '/api/v1',
	batch: function (requests) {
		// make your single API call
	}
});
```

### Ember Model Example
```javascript
Ember.RESTAdapter.reopen(Ember.AdapterBatchMixin, {
	batch: function (requests) {
		// make your single API call
	}
});
```

##Usage
Because batch API paradigms aren't all the same, you'll need to implement the `batch` method on your adapter.

This method will get called whenever multiple models are being synced to the server within the same `Ember.run` loop iteration.

Request argument format:

```javascript
[{
	// The adapter's original ajax() method arguments
	args: <Arguments>,
	// Call this function with the resolved data for this particular request
	resolve: <Function>
	// Call this function with the rejected data for this particular request
	reject: <Function>
}]
```

##Uhhh...I don't get it...
Yeah...I know. I made this for myself, so it's difficult to explain what this solves. Maybe I'll throw together an example using Facebooks Open Graph batch API? (open an issue request...)

##License
MIT Licensed