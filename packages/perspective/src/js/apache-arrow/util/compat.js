/**
 * @ignore
 */
export function isPromise(x) {
    return x != null && Object(x) === x && typeof x['then'] === 'function';
}
/**
 * @ignore
 */
export function isObservable(x) {
    return x != null && Object(x) === x && typeof x['subscribe'] === 'function';
}
/**
 * @ignore
 */
export function isArrayLike(x) {
    return x != null && Object(x) === x && typeof x['length'] === 'number';
}
/**
 * @ignore
 */
export function isIterable(x) {
    return x != null && Object(x) === x && typeof x[Symbol.iterator] !== 'undefined';
}
/**
 * @ignore
 */
export function isAsyncIterable(x) {
    return x != null && Object(x) === x && typeof x[Symbol.asyncIterator] !== 'undefined';
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWwvY29tcGF0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQWVBOztHQUVHO0FBQ0gsTUFBTSxvQkFBb0IsQ0FBTTtJQUM1QixNQUFNLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLFVBQVUsQ0FBQztBQUMzRSxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxNQUFNLHVCQUF1QixDQUFNO0lBQy9CLE1BQU0sQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsV0FBVyxDQUFDLEtBQUssVUFBVSxDQUFDO0FBQ2hGLENBQUM7QUFFRDs7R0FFRztBQUNILE1BQU0sc0JBQXNCLENBQU07SUFDOUIsTUFBTSxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxRQUFRLENBQUM7QUFDM0UsQ0FBQztBQUVEOztHQUVHO0FBQ0gsTUFBTSxxQkFBcUIsQ0FBTTtJQUM3QixNQUFNLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxXQUFXLENBQUM7QUFDckYsQ0FBQztBQUVEOztHQUVHO0FBQ0gsTUFBTSwwQkFBMEIsQ0FBTTtJQUNsQyxNQUFNLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxXQUFXLENBQUM7QUFDMUYsQ0FBQyIsImZpbGUiOiJ1dGlsL2NvbXBhdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBpbnRlcmZhY2UgU3Vic2NyaXB0aW9uIHtcbiAgICB1bnN1YnNjcmliZTogKCkgPT4gdm9pZDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBPYnNlcnZlcjxUPiB7XG4gICAgY2xvc2VkPzogYm9vbGVhbjtcbiAgICBuZXh0OiAodmFsdWU6IFQpID0+IHZvaWQ7XG4gICAgZXJyb3I6IChlcnI6IGFueSkgPT4gdm9pZDtcbiAgICBjb21wbGV0ZTogKCkgPT4gdm9pZDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBPYnNlcnZhYmxlPFQ+IHtcbiAgICBzdWJzY3JpYmU6IChvYnNlcnZlcjogT2JzZXJ2ZXI8VD4pID0+IFN1YnNjcmlwdGlvbjtcbn1cblxuLyoqXG4gKiBAaWdub3JlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1Byb21pc2UoeDogYW55KTogeCBpcyBQcm9taXNlTGlrZTxhbnk+IHtcbiAgICByZXR1cm4geCAhPSBudWxsICYmIE9iamVjdCh4KSA9PT0geCAmJiB0eXBlb2YgeFsndGhlbiddID09PSAnZnVuY3Rpb24nO1xufVxuXG4vKipcbiAqIEBpZ25vcmVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzT2JzZXJ2YWJsZSh4OiBhbnkpOiB4IGlzIE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHggIT0gbnVsbCAmJiBPYmplY3QoeCkgPT09IHggJiYgdHlwZW9mIHhbJ3N1YnNjcmliZSddID09PSAnZnVuY3Rpb24nO1xufVxuXG4vKipcbiAqIEBpZ25vcmVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXlMaWtlKHg6IGFueSk6IHggaXMgQXJyYXlMaWtlPGFueT4ge1xuICAgIHJldHVybiB4ICE9IG51bGwgJiYgT2JqZWN0KHgpID09PSB4ICYmIHR5cGVvZiB4WydsZW5ndGgnXSA9PT0gJ251bWJlcic7XG59XG5cbi8qKlxuICogQGlnbm9yZVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNJdGVyYWJsZSh4OiBhbnkpOiB4IGlzIEl0ZXJhYmxlPGFueT4ge1xuICAgIHJldHVybiB4ICE9IG51bGwgJiYgT2JqZWN0KHgpID09PSB4ICYmIHR5cGVvZiB4W1N5bWJvbC5pdGVyYXRvcl0gIT09ICd1bmRlZmluZWQnO1xufVxuXG4vKipcbiAqIEBpZ25vcmVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQXN5bmNJdGVyYWJsZSh4OiBhbnkpOiB4IGlzIEFzeW5jSXRlcmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHggIT0gbnVsbCAmJiBPYmplY3QoeCkgPT09IHggJiYgdHlwZW9mIHhbU3ltYm9sLmFzeW5jSXRlcmF0b3JdICE9PSAndW5kZWZpbmVkJztcbn1cbiJdfQ==
