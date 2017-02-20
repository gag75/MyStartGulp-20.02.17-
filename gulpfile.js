"use strict";

//gulp дополнительные утилиты
var gulp          = require("gulp");
var clean         = require('gulp-clean');
var concat        = require("gulp-concat");
var newer         = require("gulp-newer");
//

//сервер
var browserSync   = require("browser-sync");
var reload        = browserSync.reload;
//

//обработка ошибок gulp
var plumber       = require("gulp-plumber");
//

//шаблонизатор
var pug           = require("gulp-pug");
//

//стили
var postcss       = require("gulp-postcss");//css стилии
var autoprefixer  = require("autoprefixer");
var precss        = require("precss");
var cssnano       = require("cssnano");
var mqpacker      = require("css-mqpacker");
//


//Пути
// var _src    = './src/',
//     _dist   = './dist/',
//     _public = './public/';
//
// var _js     = 'js/',
//     _css    = 'css/',
//     _img    = 'img/',
//     _html   = 'html/';
var paths = {
    "styles": {
        "src"   : "./src/precss/*.css",
        "watch" : "./src/precss/**/*.css",
        "build" : "./build/styles"
    },
    "pug": {
        "src"   : "./src/pug/*.pug",
        "watch" : "./src/pug/**/*.pug",
        "build" : "./build"
    },
    "scripts": {
        "src"   : "./src/js/**/*.js",
        "watch" : "./src/js/**/*.js",
        "build" : "./build/js"
    },
    "images": {
        "src"   : "./src/img/**/*.{jpg,png,svg}",
        "watch" : "./src/img/**/*.{jpg,png,svg}",
        "build" : "./build/img"
    },
    "fonts": {
        "src"  : "./src/fonts/**/*",
        "watch" : "./src/fonts/**/*",
        "build" : "./build/fonts"
    },
    "build" : "build"
};
//

//Задачи
gulp.task("styles", function () {
    var processors = [
        precss,
        autoprefixer,
        mqpacker
    ];
    return gulp.src(paths.styles.src)
        .pipe(plumber())
        .pipe(postcss(processors))
        .pipe(gulp.dest(paths.styles.build))
        .pipe(reload({stream:true}));
});

gulp.task("scripts", function() {
  return gulp.src(paths.scripts.src)
    .pipe(plumber())
    .pipe(gulp.dest(paths.scripts.build))
    .pipe(reload({stream:true}));
});

gulp.task("scripts:vendor", function() {
  return gulp.src([
        "./bower_components/jQuery/dist/jquery.min.js"
    ])
        .pipe(plumber())
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('./build/js'));
});

gulp.task("pug", function () {
    return gulp.src(paths.pug.src)
        .pipe(plumber())
        .pipe(pug({
            pretty: "\t"
        }))
        .pipe(gulp.dest(paths.pug.build))
        .pipe(reload({stream:true}));
});

gulp.task("images", function () {
    return gulp.src(paths.images.src)
        .pipe(plumber())
        .pipe(newer(paths.images.src))
        .pipe(gulp.dest(paths.images.build))
        .pipe(reload({stream:true}));
});

gulp.task('sprites', function() {
    var spriteData =
        gulp.src('./src/sprites/*.*') // путь, откуда берем картинки для спрайта
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: 'sprite.css',
                padding: 4
            }));

    spriteData.img.pipe(gulp.dest('./built/images/')); // путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest('./built/styles/')); // путь, куда сохраняем стили
});

gulp.task("fonts", function () {
    return gulp.src(paths.fonts.src)
        .pipe(plumber())
        .pipe(newer(paths.fonts.src))
        .pipe(gulp.dest(paths.fonts.build))
        .pipe(reload({stream:true}));
});




gulp.task('clean', function () {
    return gulp.src('build', {read: false})
        .pipe(clean());
});

gulp.task("browserSync", function() {
    browserSync({
        server: {
            baseDir: paths.build
        }
    });
});



gulp.task ("watch", function(){
    gulp.watch(paths.styles.watch, ["styles"]);
    gulp.watch(paths.pug.watch, ["pug"]);
    gulp.watch(paths.scripts.watch, ["scripts"]);
    gulp.watch(paths.images.watch, ["images"]);
    gulp.watch(paths.fonts.watch, ["fonts"]);
});

gulp.task("default", ["browserSync", "styles", "pug", "scripts", "scripts:vendor" ,"images", "fonts", "watch"]);
