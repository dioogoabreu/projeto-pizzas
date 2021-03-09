let cart = [];
let modalQt = 1;
let modalKey = 0;
const c = el => document.querySelector(el);
const cs = el => document.querySelectorAll(el);

pizzaJson.map((item, index) => {

    // Criando os clones para cada um item da pizza
    let pizzaItem = c('.models .pizza-item').cloneNode(true);

    // Adicionando informações nas pizzas
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;

    // Adicionando informações nos modais de cada pizza
    pizzaItem.querySelector('a').addEventListener('click', e => {
        e.preventDefault();

        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalKey = key;
        
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo .pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;


        /* Lógica
        
        Classe: pizzaInfo--size
        Percorrer todos itens que tem essa classe, e no "span"
        setar um texto neles.

        */


        // Ajustando o modal
        c('.pizzaInfo--size.selected').classList.remove('selected');
        cs('.pizzaInfo--size').forEach((size, sizeIndex) => {

            if (sizeIndex == 2) {
                size.classList.add('selected');
            }

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        c('.pizzaInfo--qt').innerHTML = modalQt;


        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });

    // Adicionando as pizzas na tela: PizzaItem = Clones das pizzas
    c('.pizza-area').append(pizzaItem);
});


// Funções do Modal

function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        c('.pizzaWindowArea').style.display = 'none';
    }, 200);
}

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach(item => {
    item.addEventListener('click', closeModal);
});

// Adicionar a quantidade de pizzaJson[key].
c('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});

c('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});

// Ao clicar em um tamanho, ele irá selecionar ele e remover todos os outros

cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', e => {
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

// Pegar informações da pizza e adicionar em um array

c('.pizzaInfo--addButton').addEventListener('click', () => {

    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identifier = "id: "+pizzaJson[modalKey].id+"@"+"size: "+size;


    let key = cart.findIndex(item => {
        return item.identifier == identifier;
    });

    if (key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        });
    }

    
    cartUpdate();
    closeModal();

});


c('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) {
        c('aside').style.left = '0';
    }
})


c('.menu-closer').addEventListener('click', () => {
    c('aside').style.left = '100vw';
})


function cartUpdate(){
    
    c('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for (let i in cart) {
            let pizzaItem = pizzaJson.find(item => item.id == cart[i].id);
            
            subtotal += pizzaItem.price * cart[i].qt;
            
            let pizzaSizeName;

            switch (cart[i].size) {
                case 0:
                    pizzaSizeName = "P";
                    break;
                case 1:
                    pizzaSizeName = "M";
                    break;
                case 2:
                    pizzaSizeName = "G";
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
            
            let cardItem = c('.models .cart--item').cloneNode(true);
            cardItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cardItem.querySelector('img').src = pizzaItem.img;
            cardItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cardItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                cartUpdate();
            });
            cardItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                cartUpdate();
            });

            c('.cart').append(cardItem);
        }


        desconto = subtotal * 0.1;
        total = subtotal - desconto;
        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        c('aside').classList.add('remove');
    }
};