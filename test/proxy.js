'use strict';

const expect = require('chai').expect;

describe('proxy', () => {
  const proxy = require('../lib/proxy');

  it('should maintain 0-length function signature', () => {
    class Foo {
      //noinspection JSUnusedGlobalSymbols
      bar() {
        return Promise.resolve();
      }
    }
    const foo = new Foo();
    const result = proxy(foo);

    expect(result.bar).to.be.a('function').with.lengthOf(0);
  });
  it('should maintain non-0-length function signature', () => {
    class Foo {
      //noinspection JSUnusedGlobalSymbols
      bar(a, b, c) {
        return Promise.resolve([a, b, c]);
      }
    }
    const foo = new Foo();
    const result = proxy(foo);

    expect(result.bar).to.be.a('function').with.lengthOf(3);
  });

  it('should keep original method with Async suffix', () => {
    class Foo {
      //noinspection JSUnusedGlobalSymbols
      bar() {
        return Promise.resolve();
      }
    }
    const foo = new Foo();
    const originalFooBar = foo.bar;
    const result = proxy(foo);

    expect(result.barAsync).to.equal(originalFooBar);
  });

  it('should call the callback on resolved promise', done => {
    class Foo {
      //noinspection JSUnusedGlobalSymbols
      bar() {
        return Promise.resolve();
      }
    }
    const foo = new Foo();
    const result = proxy(foo);

    result.bar(done);
  });
  it('should call the callback on rejected promise', done => {
    class Foo {
      //noinspection JSUnusedGlobalSymbols
      bar() {
        return Promise.reject(new Error());
      }
    }
    const foo = new Foo();
    const result = proxy(foo);

    result.bar(error => {
      expect(error).to.be.an.instanceOf(Error);
      done();
    });
  });
});
