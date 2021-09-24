const {src, dest} = require('gulp');
const gulp = require('gulp');
const browsersync = require('browser-sync').create();
const nunjucksRender = require('gulp-nunjucks-render');
const del = require('del');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const gcmq = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
// const webp = require('gulp-webp');

sass.compiler = require('node-sass');

const projectFolder = 'dist';
const sourseFolder = '#src';
const PATH = {
  build: {
    html: `${projectFolder}/`,
    css: `${projectFolder}/css/`,
    js: `${projectFolder}/js/`,
    img: `${projectFolder}/img/`,
    fonts: `${projectFolder}/fonts/`,
    assets: `${projectFolder}/`
  },
  src: {
    html: `${sourseFolder}/templates/pages/**/*.+(html|nunjucks)`,
    css: `${sourseFolder}/scss/**/*.scss`,
    js: `${sourseFolder}/js/script.js`,
    js1: `${sourseFolder}/js/cardprod.js`,
    jsVendor: `${sourseFolder}/js/vendor.js`,
    img: `${sourseFolder}/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}`,
    fonts: `${sourseFolder}/fonts/*.woff2`,
    assets: `${sourseFolder}/assets/**/*`
  },
  watch: {
    // html: `${sourseFolder}/**/*.+(html|nunjucks)`,
    html: `${sourseFolder}/templates/**/*.+(html|nunjucks)`,
    css: `${sourseFolder}/scss/**/*.scss`,
    js: `${sourseFolder}/js/**/*.js`,
    img: `${sourseFolder}/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}`,
    fonts: `${sourseFolder}/fonts/*.woff2`,
    assets: `${sourseFolder}/assets/**/*`
  },
  clean: `./${projectFolder}/`
}

const LIBS_JAVASCRIPT = [
  './node_modules/external-svg-loader/svg-loader.min.js', // svg-loader
  './node_modules/imask/dist/imask.min.js', // Mask Input
  './node_modules/micromodal/dist/micromodal.min.js', // Mask Input
  './node_modules/swiper/swiper-bundle.min.js', // Slider
  './node_modules/slidetoggle/dist/slidetoggle.js', // Slidetoggle
  './node_modules/nouislider/dist/nouislider.min.js', // nouislider

  // './node_modules/jquery-match-height/dist/jquery.matchHeight-min.js', // Slider
  // './node_modules/magnific-popup/dist/jquery.magnific-popup.min.js', // Popups
  // './node_modules/parallax-js/dist/parallax.min.js', // Popups
  // './node_modules/aos/dist/aos.js', // Popups
]

function watchFiles() {
  gulp.watch([PATH.watch.html], html);
  gulp.watch([PATH.watch.css], css);
  gulp.watch([PATH.watch.js], js);
  gulp.watch([PATH.watch.js], js1);
  gulp.watch([PATH.watch.img], images);
  gulp.watch([PATH.watch.fonts], fonts);
  gulp.watch([PATH.watch.assets], assets);
}

// Other tasks //

gulp.task('imagemin', function() {
  return src(PATH.src.img)

  // .pipe(webp({quality: 70}))
  // .pipe(dest(PATH.build.img))

  // .pipe(PATH.src.img)

  .pipe(imagemin({
      progressive: true,
      interlaced: true,
      optimizationLevel: 3, // 0 to 7
      svgoPlugins: [{removeViewBox: false}]
    }
  ))
  .pipe(dest(PATH.build.img))
  .pipe(browsersync.stream())
})

// Main tasks //

function html() {
  return src(PATH.src.html)
  .pipe(nunjucksRender({path: [`./${sourseFolder}/templates`]}))
  .pipe(dest(PATH.build.html))
  .pipe(browsersync.stream())
}

function css() {
  return src(PATH.src.css)
  .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
  .pipe(gcmq())
  .pipe(autoprefixer({overrideBrowserslist: ['last 5 versions'], cascade: true}))
  .pipe(dest(PATH.build.css)) // файл не сжатый
  .pipe(cleanCSS())
  .pipe(rename({extname: '.min.css'}))
  .pipe(dest(PATH.build.css))
  .pipe(browsersync.stream())
}

function js() {
  return src(PATH.src.js)
  .pipe(rename(function(path) {path.basename = "bundle";}))
  .pipe(babel({presets: ['@babel/env']}))
  .pipe(dest(PATH.build.js)) // файл не сжатый
  .pipe(uglify())
  .pipe(rename(function(path) {path.basename = "bundle"; path.extname = ".min.js";}))
  .pipe(dest(PATH.build.js))
  .pipe(browsersync.stream())
}

function js1() {
  return src(PATH.src.js1)
  .pipe(dest(PATH.build.js)) // файл не сжатый
  .pipe(browsersync.stream())
}

function jsVendor() {
  return src(LIBS_JAVASCRIPT)
  .pipe(concat('vendors.min.js'))
  .pipe(dest(PATH.build.js))
  .pipe(browsersync.stream())
}

function jsJquery() {
  return src([
    './node_modules/jquery/dist/jquery.min.js',
  ])
  .pipe(concat('jquery.min.js'))
  .pipe(dest(PATH.build.js))
  .pipe(browsersync.stream())
}

function images() {
  return src(PATH.src.img)

  // .pipe(webp({quality: 70}))
  // .pipe(dest(PATH.build.img))

  // .pipe(PATH.src.img)
  // .pipe(imagemin({
  //     progressive: true,
  //     interlaced: true,
  //     optimizationLevel: 3, // 0 to 7
  //     svgoPlugins: [{removeViewBox: false}]
  //   }
  // ))

  .pipe(dest(PATH.build.img))
  .pipe(browsersync.stream())
}

function fonts() {
  return src(PATH.src.fonts)
  .pipe(dest(PATH.build.fonts))
  .pipe(browsersync.stream())
}

function assets() {
  return src(PATH.src.assets)
  .pipe(dest(PATH.build.assets))
  .pipe(browsersync.stream())
}

function browserSync() {
  browsersync.init({
    server: {
      baseDir: `./${projectFolder}/`
    },
    port: 3000,
    notify: false
  })
}

function clean() {
  return del(PATH.clean)
}

const build = gulp.series(clean, gulp.parallel(jsJquery, jsVendor, js, js1, css, html, images, fonts, assets));
const watch = gulp.parallel(build, watchFiles, browserSync);

exports.html = html;
exports.css = css;
exports.js = js;
exports.js1 = js1;
exports.jsVendor = jsVendor;
exports.jsJquery = jsJquery;
exports.images = images;
exports.fonts = fonts;
exports.assets = assets;

exports.build = build;
exports.watch = watch;
exports.default = watch;
