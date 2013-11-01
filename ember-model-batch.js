(function (Ember) {
    var queue = [];

    Ember.AdapterBatchMixin = Ember.Mixin.create({
        /**
         * Override this method to actually make your batch API call, then
         * resolve/reject each request.
         */
        batch: function (requests) {
            throw new Error('Your model needs to implement the batch() method. See https://github.com/jayphelps/ember-model-batch/blob/master/README.md');
        },

        _flushQueue: function () {
            if (!queue.length) return;

            var ajaxHook = this.ajax,
                ajaxOriginal = this.constructor.__super__.ajax,
                request;

            // If there's only one thing in the queue, no sense batching it
            if (queue.length === 1) {
                request = queue.shift();
                ajaxOriginal.apply(this, request.args).then(function () {
                    request.resolve.apply(this, arguments);
                }, function () {
                    request.reject.apply(this, arguments);
                });
            } else {
                // Reset original ajax method so they can use it if they'd like
                this.ajax = ajaxOriginal;
                // Run batch with a deep copy so no side-effects if they alter it
                this.batch(Ember.copy(queue, true));
                // Empty the queue and add our hook back;
                queue.length = 0;
                this.ajax = ajaxHook;
            }
        },

        ajax: function () {
            var adapter = this,
                ajaxArguments = arguments;

            return new Ember.RSVP.Promise(function (resolve, reject) {
                queue.push({
                    args: ajaxArguments,
                    resolve: resolve,
                    reject: reject
                });
                
                Ember.run.later(function () {
                    Ember.run.once(adapter, adapter._flushQueue);
                });
            });
        }
    });

})(Ember);
