
class FlutterwaveService {

    async MockFlutterwavePayment (amount) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { status: 'success', amount };
    };
}

module.exports = FlutterwaveService
