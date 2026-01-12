/**
 * Generate WhatsApp chat URL
 * @param phoneNumber Phone number in international format (e.g., 96812345678)
 * @param message Optional pre-filled message
 * @returns WhatsApp web URL
 */
export function getWhatsAppUrl(phoneNumber: string, message?: string): string {
    // Remove any non-digit characters
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    // Ensure it starts with country code (968 for Oman)
    let formattedPhone = cleanPhone;
    if (!formattedPhone.startsWith('968')) {
        // If it starts with 0, replace with 968
        if (formattedPhone.startsWith('0')) {
            formattedPhone = '968' + formattedPhone.substring(1);
        } else {
            formattedPhone = '968' + formattedPhone;
        }
    }

    const baseUrl = 'https://wa.me/';
    const encodedMessage = message ? encodeURIComponent(message) : '';
    
    if (encodedMessage) {
        return `${baseUrl}${formattedPhone}?text=${encodedMessage}`;
    }
    
    return `${baseUrl}${formattedPhone}`;
}

/**
 * Open WhatsApp chat in new window
 */
export function openWhatsAppChat(phoneNumber: string, message?: string): void {
    const url = getWhatsAppUrl(phoneNumber, message);
    window.open(url, '_blank');
}
