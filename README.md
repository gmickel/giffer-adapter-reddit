# giffer-adapter-reddit

Reddit adapter for giffer.

## authentication

enter your Reddit API creditials in the `config.js` file, see `config.js.example` 


## configuration

The following configuration options are available:

### `subreddit`

The subreddit from which to grab gifs.

### `sorting`

The subreddit filter method to use. Possible values are `hot`, `new`, `controversial` or `top`.

### `userAgent`

The custom User-Agent String this app should use

### `throttle`

The default wait is 1 request per 2 seconds. If you use OAuth for authentication, you can set this to 1 request per second (1000)
To disable, set to 0

### `limit`

The number of posts to get per request

### `max_attempts`

NYI

### `poll_interval`

The interval to use between requests

### `items_to_get`

The total number of posts to grab images from
