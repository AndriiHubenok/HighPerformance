const sinon = require('sinon');
const { expect } = require('chai');
const axios = require('axios');

const orangeHrmService = require('../services/orangeHrmService');
const Salesman = require('../models/Salesman');

describe('Integration Tests with Stubs', function () {

    // Clean up stubs after each test to avoid interference between tests
    afterEach(function () {
        sinon.restore();
    });

    // OrangeHRM Integration Tests
    describe('Service: OrangeHRM', function () {

        describe('Scenario: Service is online (reachable)', function () {
            it('should fetch employee list successfully', async function () {
                const mockResponse = {
                    data: {
                        data: [
                            { employeeId: 1, firstName: 'John', lastName: 'Doe', jobTitle: 'Sales' }
                        ]
                    }
                };
                const axiosStub = sinon.stub(axios, 'get').resolves(mockResponse);

                const result = await orangeHrmService.getAllEmployees();

                expect(axiosStub.calledOnce).to.be.true;
                expect(result).to. be.an('array');
                expect(result[0].firstName).to.equal('John');
            });
        });

        describe('Scenario: Service is offline (not reachable)', function () {
            it('should throw an error when API is down', async function () {
                const axiosStub = sinon.stub(axios, 'get').rejects(new Error('Network Error'));

                try {
                    await orangeHrmService.getAllEmployees();
                    throw new Error('Test failed: Should have thrown an error');
                } catch (err) {
                    expect(axiosStub.calledOnce).to.be.true;
                    expect(err.message).to.include('Failed to fetch employees');
                }
            });
        });
    });

    // MongoDB Integration Tests
    describe('Service: MongoDB (Mongoose Models)', function () {

        describe('Scenario: Service is online (Database Connected)', function () {
            it('should retrieve salesman data from DB', async function () {
                const mockData = [
                    { sid: 1, firstname: 'Max', lastname: 'Power' }
                ];

                const findStub = sinon.stub(Salesman, 'find').resolves(mockData);

                const result = await Salesman.find({ sid: 1 });

                expect(findStub.calledOnce).to.be.true;
                expect(result[0].firstname).to.equal('Max');
            });
        });

        describe('Scenario: Service is offline (Database Disconnected)', function () {
            it('should throw error when DB query fails', async function () {
                const findStub = sinon.stub(Salesman, 'find').rejects(new Error('MongoTimeoutError'));

                try {
                    await Salesman.find({ sid: 1 });
                    throw new Error('Should have failed');
                } catch (err) {
                    expect(findStub.calledOnce).to.be.true;
                    expect(err.message).to.equal('MongoTimeoutError');
                }
            });
        });
    });

});