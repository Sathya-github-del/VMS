import { useState } from 'react';
import { visitorService } from '../services/visitorService';
import { validateVisitorData } from '../utils/validationUtils';

export const useVisitorOperations = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const submitVisitor = async (visitorData) => {
        setLoading(true);
        setError(null);

        try {
            const { isValid, errors } = validateVisitorData(visitorData);
            if (!isValid) {
                throw new Error(Object.values(errors)[0]);
            }

            const result = visitorService.createVisitor(visitorData);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const approveVisitor = async (visitorId) => {
        setLoading(true);
        setError(null);

        try {
            const result = visitorService.updateVisitorStatus(visitorId, 'approved');
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const checkInVisitor = async (visitorId) => {
        setLoading(true);
        setError(null);

        try {
            const result = visitorService.checkInVisitor(visitorId);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        submitVisitor,
        approveVisitor,
        checkInVisitor
    };
};
