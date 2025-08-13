# Script de Instalação e Configuração do Sistema de Gestão de Restaurante

echo "🍽️  Instalando Sistema de Gestão de Restaurante..."
echo "=================================================="

# Instalar dependências do projeto principal
echo "📦 Instalando dependências principais..."
npm install

# Instalar dependências do servidor
echo "🔧 Instalando dependências do servidor..."
cd server
npm install
cd ..

# Instalar dependências do cliente
echo "⚛️  Instalando dependências do cliente..."
cd client
npm install
cd ..

echo ""
echo "✅ Instalação concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure o arquivo server/.env com suas variáveis de ambiente"
echo "2. Execute 'npm run setup' para configurar o banco de dados"
echo "3. Execute 'npm run dev' para iniciar o sistema"
echo ""
echo "🌐 URLs de acesso:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:5000"
echo ""
echo "👥 Usuários padrão (serão criados automaticamente):"
echo "- Admin: admin@restaurante.com / admin123"
echo "- Recepcionista: recepcao@restaurante.com / recepcao123"
echo "- Cozinheira: cozinha@restaurante.com / cozinha123"
