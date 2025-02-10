export const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
};

export const validateEmail = (email) => {
    if (!email) return true; // Email is optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validateVisitorData = (data) => {
    const errors = {};

    if (!data.name?.trim()) {
        errors.name = 'Name is required';
    }

    if (!data.phone?.trim()) {
        errors.phone = 'Phone number is required';
    } else if (!validatePhone(data.phone)) {
        errors.phone = 'Invalid phone number';
    }

    if (data.email && !validateEmail(data.email)) {
        errors.email = 'Invalid email address';
    }

    if (!data.purpose?.trim()) {
        errors.purpose = 'Purpose is required';
    }

    if (!data.visitingMember?.trim()) {
        errors.visitingMember = 'Visiting member name is required';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};
