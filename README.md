# [Some Component - jQuery plugin](http://i-3global/) #

>A jQuery Plugin by i3 Global

Main features:

* modular architecture
* responsive
* CSS3 transitions


## Getting started ##

### 1. Get a copy of the plugin ###

You can fork or download the plugin from GitHub, or you can install it through `npm` or `bower`.

```
$ npm install i3g-component
```

```
$ bower install i3g-component
```

### 2. Load the required files ###

Import inside your main SCSS file. Add your own variable.scss before this component to customize the theme.

Bower Install Example:

```html
@import "variables.scss";
@import "../../bower_components/i3g-component/dist/scss/main.scss";
```

In the page's footer, just before <code>&lt;/body&gt;</code>, include the required JavaScript files.

```html
<script src="libs/js/jquery-1.11.0.min.js"></script>
<script src="../../bower_components/i3g-component/dist/js/jquery.i3g-component.js"></script>
```

### 3. Create the HTML markup ###

```html
<div id="my-component">

</div>
```


### 4. Instantiate the component ###

```html
<script type="text/javascript">
	jQuery( document ).ready(function( $ ) {
		$( '#my-component' ).myComponent();
	});
</script>
```



## Support ##

Currently Unsupported

## License ##

The plugin is available under the <a href="http://opensource.org/licenses/MIT">MIT license</a>.
