/**
 * Zakat Calculator - Core Logic and State Management
 */

class ZakatCalculator {
    constructor() {
        this.holdings = JSON.parse(localStorage.getItem('zakat_portfolio')) || [];
        this.init();
    }

    init() {
        this.renderHoldings();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const addBtn = document.getElementById('zakat-add-btn');
        if (addBtn) addBtn.addEventListener('click', () => this.addHolding());

        const calcBtn = document.getElementById('zakat-calculate-btn');
        if (calcBtn) calcBtn.addEventListener('click', () => this.calculateTotal());

        const clearBtn = document.getElementById('zakat-clear-btn');
        if (clearBtn) clearBtn.addEventListener('click', () => this.clearPortfolio());

        const typeSelect = document.getElementById('zakat-share-type');
        if (typeSelect) typeSelect.addEventListener('change', (e) => this.toggleInvestmentFields(e.target.value));
    }

    toggleInvestmentFields(type) {
        const fields = document.getElementById('zakat-investment-fields');
        if (fields) {
            fields.style.display = type === 'investment' ? 'block' : 'none';
        }
    }

    addHolding() {
        const company = document.getElementById('zakat-company').value.trim();
        const shares = parseFloat(document.getElementById('zakat-shares').value);
        const price = parseFloat(document.getElementById('zakat-price').value);
        const type = document.getElementById('zakat-share-type').value;

        if (!shares || shares <= 0 || !price || price <= 0 || !type) {
            this.showMessage('Please fill in all required fields accurately.', 'error');
            return;
        }

        const marketValue = shares * price;
        let zakatAmount = 0;
        let ratio = 1.0;

        if (type === 'trading') {
            zakatAmount = marketValue * 0.025;
        } else {
            const zakatableAssets = parseFloat(document.getElementById('zakat-assets').value);
            const totalAssets = parseFloat(document.getElementById('zakat-total-assets').value);

            if (!zakatableAssets || !totalAssets || totalAssets <= 0) {
                this.showMessage('Please provide valid company asset data for investment shares.', 'error');
                return;
            }
            ratio = zakatableAssets / totalAssets;
            zakatAmount = marketValue * ratio * 0.025;
        }

        const holding = {
            id: Date.now(),
            company: company || `Asset ${this.holdings.length + 1}`,
            shares,
            price,
            marketValue,
            type,
            zakatAmount,
            ratio: type === 'investment' ? ratio : null
        };

        this.holdings.push(holding);
        this.saveAndRender();
        this.resetForm();
        this.showMessage('Holding added successfully.', 'success');
    }

    removeHolding(id) {
        this.holdings = this.holdings.filter(h => h.id !== id);
        this.saveAndRender();
    }

    clearPortfolio() {
        if (confirm('Are you sure you want to clear your entire portfolio?')) {
            this.holdings = [];
            this.saveAndRender();
            this.hideResult();
        }
    }

    saveAndRender() {
        localStorage.setItem('zakat_portfolio', JSON.stringify(this.holdings));
        this.renderHoldings();
    }

    renderHoldings() {
        const list = document.getElementById('zakat-holdings-list');
        const count = document.getElementById('zakat-holdings-count');
        const section = document.getElementById('zakat-portfolio-section');

        if (!list || !count || !section) return;

        count.textContent = this.holdings.length;
        section.style.display = this.holdings.length > 0 ? 'block' : 'none';

        list.innerHTML = this.holdings.map(h => `
            <div class="zakat-holding-item">
                <div>
                    <strong>${h.company}</strong>
                    <div class="zakat-holding-details">
                        <span>${h.shares} Shares</span>
                        <span>@ $${h.price.toFixed(2)}</span>
                        <span>= $${h.marketValue.toFixed(2)}</span>
                        <span class="zakat-badge zakat-badge-${h.type}">${h.type}</span>
                    </div>
                </div>
                <button class="zakat-btn zakat-btn-danger" onclick="window.zakatCalc.removeHolding(${h.id})" style="padding: 5px 10px;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    calculateTotal() {
        const nisabInput = document.getElementById('zakat-nisab');
        const nisab = nisabInput ? parseFloat(nisabInput.value) || 0 : 0;

        const finalValue = this.holdings.reduce((sum, h) => sum + h.marketValue, 0);
        const finalTotal = this.holdings.reduce((sum, h) => sum + h.zakatAmount, 0);

        const resultCard = document.getElementById('zakat-result-card');
        const amountDisplay = document.getElementById('zakat-final-amount');
        const portfolioValueDisplay = document.getElementById('zakat-portfolio-value');

        if (resultCard && amountDisplay) {
            // Nisab Check: If total wealth is below Nisab, Zakat is 0
            if (finalValue < nisab) {
                amountDisplay.textContent = "0.00 (Below Nisab)";
                amountDisplay.style.fontSize = "2rem";
            } else {
                amountDisplay.textContent = finalTotal.toFixed(2);
                amountDisplay.style.fontSize = ""; // Reset to CSS default
            }

            if (portfolioValueDisplay) portfolioValueDisplay.textContent = finalValue.toFixed(2);
            resultCard.style.display = 'block';
            resultCard.scrollIntoView({ behavior: 'smooth' });
        }
    }

    hideResult() {
        const resultCard = document.getElementById('zakat-result-card');
        if (resultCard) resultCard.style.display = 'none';
    }

    resetForm() {
        document.getElementById('zakat-company').value = '';
        document.getElementById('zakat-shares').value = '';
        document.getElementById('zakat-price').value = '';
        document.getElementById('zakat-share-type').value = '';
        this.toggleInvestmentFields('');
    }

    showMessage(text, type) {
        // Simple alert for now, can be improved to a toast
        alert(`${type.toUpperCase()}: ${text}`);
    }
}

// Initialize on window load
window.addEventListener('load', () => {
    window.zakatCalc = new ZakatCalculator();
});
