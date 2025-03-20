class LolycoinSystem:
    def __init__(self):
        # Inicializa o saldo de Lolycoins e os itens disponíveis
        self.saldo = 0
        self.inventario = []
        self.loja = {
            "figurinha": 50,
            "wallpaper": 100,
            "avatar": 200
        }

    def adicionar_saldo(self, quantidade):
        """Adiciona Lolycoins ao saldo."""
        if quantidade > 0:
            self.saldo += quantidade
            return f"Você adicionou {quantidade} Lolycoins. Saldo atual: {self.saldo} Lolycoins."
        return "Quantidade inválida para adicionar."

    def comprar_item(self, item):
        """Compra um item da loja se houver saldo suficiente."""
        if item in self.loja:
            preco = self.loja[item]
            if self.saldo >= preco:
                self.saldo -= preco
                self.inventario.append(item)
                return f"Você comprou {item} por {preco} Lolycoins. Saldo restante: {self.saldo} Lolycoins."
            return "Saldo insuficiente para esta compra."
        return "Item não disponível na loja."

    def exibir_loja(self):
        """Exibe os itens disponíveis na loja e seus preços."""
        loja_disponivel = "\n".join([f"{item}: {preco} Lolycoins" for item, preco in self.loja.items()])
        return f"Itens disponíveis na loja:\n{loja_disponivel}"

    def trocar_item(self, item_venda, item_compra):
        """Permite a troca de um item no inventário por outro da loja, ajustando saldo."""
        if item_venda in self.inventario and item_compra in self.loja:
            preco_venda = self.loja[item_venda]
            preco_compra = self.loja[item_compra]
            diferenca = preco_compra - preco_venda

            if diferenca <= self.saldo:
                self.inventario.remove(item_venda)
                self.inventario.append(item_compra)
                self.saldo -= max(diferenca, 0)
                return f"Você trocou {item_venda} por {item_compra}. Saldo restante: {self.saldo} Lolycoins."
            return "Saldo insuficiente para realizar a troca."
        return "Item inválido para troca."

    def exibir_inventario(self):
        """Exibe os itens atualmente no inventário."""
        if self.inventario:
            return f"Seu inventário: {', '.join(self.inventario)}"
        return "Seu inventário está vazio."

# Exemplo de uso do sistema
sistema = LolycoinSystem()
print(sistema.adicionar_saldo(200))  # Adiciona Lolycoins
print(sistema.exibir_loja())  # Exibe a loja
print(sistema.comprar_item("figurinha"))  # Compra uma figurinha
print(sistema.exibir_inventario())  # Exibe o inventário
print(sistema.trocar_item("figurinha", "wallpaper"))  # Tenta trocar a figurinha por um wallpaper
