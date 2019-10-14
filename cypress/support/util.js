
function selectizeSelect(select, text, value = undefined) {
    cy.get(select)
        .parent()
        .find('input[type="text"]')
        .click({ force: true })
        .clear()
        .type(`{backspace}${text}`);

    const option = cy.get('.selectize-dropdown-content div.active:visible')
        .contains(`${text}`);

    if (value != undefined) {
        option.its('data-value').should('eq', value);
    }

    option.click();
}

export default { selectizeSelect }
