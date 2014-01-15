"use strict";

describe("CharLimitObserver", function () {

  beforeEach(module("angular-char-limit"));

  it("should be set up with text and limit", 
    inject(function (CharLimitObserver) {
      var observer = new CharLimitObserver("Sample text", 20);
      expect(observer.text).toBe("Sample text");
      expect(observer.limit).toBe(20);

      observer = new CharLimitObserver("Sample text", 6);
      expect(observer.text).toBe("Sample text");
      expect(observer.limit).toBe(11);
    }));

  it("should use default range when custom range is not provided", 
    inject(function (CharLimitObserver) {
      var observer = new CharLimitObserver("text", 10);
      expect(observer.getState().state).toBe("safe");
      observer.update("abcdef");
      expect(observer.getState().state).toBe("warning");
      observer.update("abcdefgh");
      expect(observer.getState().state).toBe("danger");
    }));

  it("custom range should be parsed",
    inject(function (CharLimitObserver) {
      var range = { lvl1: 0, lvl2: 4, lvl3: .8 }
        , observer = new CharLimitObserver("aa", 10, range);
      expect(observer.getState().state).toBe("lvl1");
      observer.update("aaaaa");
      expect(observer.getState().state).toBe("lvl2");
      observer.update("aaaaaaaaa");
      expect(observer.getState().state).toBe("lvl3");
    }));

  it("state should be reported according to the provided range",
    inject(function (CharLimitObserver) {
      var observer = new CharLimitObserver("text", 10);
      expect(observer.getState().state).toBe("safe");
      expect(observer.getState().remaining).toBe(6);
      expect(observer.getState().progress).toBe(0.4);
      expect(observer.getState().limit).toBe(10);
    }));
});