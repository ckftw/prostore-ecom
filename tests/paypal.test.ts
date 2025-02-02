/* eslint-disable @typescript-eslint/no-unused-vars */
import { generateAccessToken, paypal } from "../lib/paypal"
import { expect, jest, test } from '@jest/globals';


test('Generate Access Token', async () => {
    const response = await generateAccessToken();
    console.log(response);
    expect(typeof response).toBe('string');
})

test('Creates a paypal order', async () => {
    const token = await generateAccessToken();
    const price = 10.0;

    const orderResponse = await paypal.createOrder(price);
    console.log('orderResponse', orderResponse)
    expect(orderResponse).toHaveProperty('id');
    expect(orderResponse.status).toBe('CREATED');
})

test('Capture payment with mock order', async () => {
    const orderId = '100';
    const mockCapturePayment = jest.spyOn(paypal, 'capturePayment').mockResolvedValue({
        status: 'COMPLETED'
    })
    const captureResponse = await paypal.capturePayment(orderId);
    console.log('captureResponse', captureResponse)
    expect(captureResponse).toHaveProperty('status', 'COMPLETED');
    mockCapturePayment.mockRestore();
})