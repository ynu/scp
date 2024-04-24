import { describe, it } from 'node:test';
import assert from 'node:assert';
import { say_hello, times_str } from "../src/utli.js";

describe('utli testing', () => {
    const message = 'hi'
    it('say_hello test', () => {
        assert.strictEqual(say_hello(message), `${message}, World!`);
    });

    it('times_str test', () => {
        const message = 'hi'
        assert.strictEqual(times_str(3, message), `${message}${message}${message}`);
    });
}); 