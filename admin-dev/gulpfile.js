const gulp = require("gulp");
const source = require("vinyl-source-stream");
const browserify = require("browserify");
const sass = require("gulp-sass");
var uglify = require("gulp-uglify");
const buffer = require("vinyl-buffer");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");


sass.compiler = require('node-sass');

const dist = "C:/Users/enki1/OneDrive/Робочий стіл/IT/OpenServer/domains/admin_lessons/lesson_1/admin";
const distProd = "./build";


gulp.task("copy-html", () => {
  return gulp.src("./app/index.html")
             .pipe(gulp.dest(dist));
});

gulp.task("copy-api", () => {
  return gulp.src("./app/api/**/*.*")
             .pipe(gulp.dest(dist + "/api"));
});

gulp.task("copy-conf", () => {
  return gulp.src("./app/api/**/.*")
             .pipe(gulp.dest(dist + "/api"));
});

gulp.task("copy-js", () => {
  return gulp.src("./app/src/vue.js")
             .pipe(gulp.dest(dist));
});

gulp.task("copy-assets", () => {
  return gulp.src("./app/assets/**/*.*")
             .pipe(gulp.dest(dist + "/assets"));
});

gulp.task("build-js", () => {
  return browserify("./app/src/main.js", {debug: true})
        .transform("babelify", {presets: ["@babel/preset-env"], sourceMap: true})
        .bundle()
        .pipe(source("bundle.js"))
        .pipe(gulp.dest(dist));
});

gulp.task("build-css", () => {
  return gulp.src("./app/scss/style.scss")
             .pipe(sass().on("error", sass.logError))
             .pipe(gulp.dest(dist));
});

gulp.task("watch", () => {
  gulp.watch("./app/index.html", gulp.parallel("copy-html"));
  gulp.watch("./app/src/vue.js", gulp.parallel("copy-js"));
  gulp.watch("./app/api/**/*.*", gulp.parallel("copy-api"));
  gulp.watch("./app/api/**/.*", gulp.parallel("copy-conf"));
  gulp.watch("./app/assets/**/*.*", gulp.parallel("copy-assets"));
  gulp.watch("./app/src/**/*.js", gulp.parallel("build-js"));
  gulp.watch("./app/scss/**/*.scss", gulp.parallel("build-css"));  
});

gulp.task("build", gulp.parallel("copy-html", "copy-js", "copy-api", "copy-conf", "copy-assets", "build-js", "build-css"));

gulp.task("build-production", (done) => {
  gulp.src("./app/index.html")
      .pipe(gulp.dest(distProd));

  gulp.src("./app/api/**/*.*")
      .pipe(gulp.dest(distProd + "/api"));

  gulp.src("./app/api/**/.*")
      .pipe(gulp.dest(distProd + "/api"));

  gulp.src("./app/src/vue.js")
      .pipe(gulp.dest(distProd));

  gulp.src("./app/assets/**/*.*")
      .pipe(gulp.dest(distProd + "/assets"));

  browserify("./app/src/main.js", {debug: false})
      .transform("babelify", {presets: ["@babel/preset-env"], sourceMap: false})
      .bundle()
      .pipe(source("bundle.js"))
      .pipe(buffer())
      .pipe(uglify())
      .pipe(gulp.dest(distProd));
      
  gulp.src("./app/scss/style.scss")
      .pipe(sass().on("error", sass.logError))
      .pipe(autoprefixer())
      .pipe(cleanCSS())
      .pipe(gulp.dest(distProd));

      
      done();
});

gulp.task("default", gulp.parallel("watch", "build"));