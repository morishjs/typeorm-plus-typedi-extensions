import {Gulpclass, Task, SequenceTask} from "gulpclass";

const gulp = require("gulp");
const del = require("del");
const shell = require("gulp-shell");
const replace = require("gulp-replace");
const mocha = require("gulp-mocha");
const chai = require("chai");
const tslint = require("gulp-tslint");
const stylish = require("tslint-stylish");
const runSequence = require('run-sequence');

gulp.task('clean', () => {
    del(["./build/**"]);
});

gulp.task('publish', (callback: Function) => {
    gulp.src("package.json", {read: false})
        .pipe(shell([
            "cd ./build/package && npm publish"
        ], callback));
});

gulp.task('compile', () => {
    gulp.src("package.json", {read: false})
        .pipe(shell(["tsc"]));
});

gulp.task('packageFiles', () => {
    gulp.src("./build/compiled/src/**/*").pipe(gulp.dest("./build/package"));
});

gulp.task('packagePreparePackageFile', () => {
    gulp.src("./package.json")
        .pipe(gulp.dest("./build/package"));
});

gulp.task('packageReadmeFile', () => {
    gulp.src("./README.md").pipe(replace(/```typescript([\s\S]*?)```/g, "```javascript$1```"))
        .pipe(gulp.dest("./build/package"));
});

gulp.task('package', (callback: Function) => {
    runSequence("clean", "compile", ["packagePreparePackageFile", "packageReadmeFile"], callback)
});

gulp.task('tslint', () => {
    gulp.src(["./src/**/*.ts", "./test/**/*.ts", "./sample/**/*.ts"])
        .pipe(tslint())
        .pipe(tslint.report(stylish, {
            emitError: true,
            sort: true,
            bell: true
        }));
});

gulp.task('unit', () => {
    chai.should();
    chai.use(require("sinon-chai"));
    return gulp.src("./build/compiled/test/unit/**/*.js")
        .pipe(mocha());
});

gulp.task('tests', () => {
    runSequence("compile", "tslint", "unit");
});
