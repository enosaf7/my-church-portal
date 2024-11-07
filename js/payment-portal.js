document.addEventListener('DOMContentLoaded', function() {
    const paymentTypeCards = document.querySelectorAll('.payment-type-card');
    const paymentForm = document.getElementById('paymentForm');
    let selectedPaymentType = '';

    // Mobile Money Numbers
    const momoNumbers = {
        mtn: '024 XXX XXXX',
        vodafone: '020 XXX XXXX',
        airteltigo: '027 XXX XXXX'
    };

    // Handle payment type selection
    paymentTypeCards.forEach(card => {
        card.addEventListener('click', function() {
            paymentTypeCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            selectedPaymentType = this.dataset.type;
        });
    });

    // Handle payment method selection
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value !== 'card') {
                showMomoInstructions(this.value);
            }
        });
    });

    // Handle form submission
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!selectedPaymentType) {
            alert('Please select a payment type');
            return;
        }

        const amount = document.getElementById('amount').value;
        const email = document.getElementById('email').value;
        const isAnonymous = document.getElementById('anonymous').checked;
        
        // Check if a payment method is selected
        const selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
        if (!selectedPaymentMethod) {
            alert('Please select a payment method');
            return;
        }

        // Show payment instructions modal
        showPaymentInstructions(selectedPaymentMethod.value, amount);
    });
});

function showMomoInstructions(provider) {
    const momoNumbers = {
        mtn: '024 XXX XXXX',
        vodafone: '020 XXX XXXX',
        airteltigo: '027 XXX XXXX'
    };

    const instructions = document.createElement('div');
    instructions.className = 'momo-instructions';
    instructions.innerHTML = `
        <p>Send payment to: <strong>${momoNumbers[provider]}</strong></p>
        <p>Account Name: <strong>Kaneshie SDA Church</strong></p>
    `;

    // Remove any existing instructions
    const existingInstructions = document.querySelector('.momo-instructions');
    if (existingInstructions) {
        existingInstructions.remove();
    }

    // Add new instructions after the payment methods grid
    document.querySelector('.payment-methods-grid').after(instructions);
}

function showPaymentInstructions(paymentMethod, amount) {
    const momoNumbers = {
        mtn: '024 XXX XXXX',
        vodafone: '020 XXX XXXX',
        airteltigo: '027 XXX XXXX'
    };

    let instructionsHTML = '';
    
    if (paymentMethod === 'card') {
        instructionsHTML = `
            <h3>Card Payment Not Available</h3>
            <p>Please use Mobile Money for your payment.</p>
        `;
    } else {
        instructionsHTML = `
            <h3>Payment Instructions</h3>
            <p>Amount to Send: <strong>GH₵ ${amount}</strong></p>
            <p>Send to Number: <strong>${momoNumbers[paymentMethod]}</strong></p>
            <p>Account Name: <strong>Kaneshie SDA Church</strong></p>
            <ol>
                <li>Dial *170# (MTN), *110# (Vodafone), or *500# (AirtelTigo)</li>
                <li>Select Send Money</li>
                <li>Enter the church's number</li>
                <li>Enter amount: GH₵ ${amount}</li>
                <li>Enter your PIN to confirm</li>
                <li>Keep your transaction reference</li>
            </ol>
            <p class="note">After sending, please take a screenshot of the transaction and send it to our WhatsApp number for confirmation.</p>
            <button onclick="showSuccessMessage()" class="confirm-btn">I've Completed the Payment</button>
        `;
    }

    const modal = document.createElement('div');
    modal.className = 'payment-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-btn" onclick="this.parentElement.parentElement.remove()">&times;</span>
            ${instructionsHTML}
        </div>
    `;

    document.body.appendChild(modal);
}

function showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.className = 'payment-success';
    successMessage.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h2>Thank You!</h2>
            <p>Your contribution has been noted.</p>
            <p>God bless you!</p>
            <button onclick="window.location.reload()">Make Another Payment</button>
        </div>
    `;
    document.body.appendChild(successMessage);
}