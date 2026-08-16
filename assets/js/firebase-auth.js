// ==========================================
// 🔥 AUTENTICAÇÃO COM FIREBASE
// ==========================================

// ===== CONFIGURAÇÃO DO FIREBASE =====
const firebaseConfig = {
    apiKey: "AIzaSyCNta9gB0betWjrjIf3216QzFdVYmqwNt0",
    authDomain: "radiocalcbr.firebaseapp.com",
    projectId: "radiocalcbr",
    storageBucket: "radiocalcbr.firebasestorage.app",
    messagingSenderId: "344287399849",
    appId: "1:344287399849:web:2fb6b6761162c4be4c7eb8",
    measurementId: "G-ZMDMQGN6E0"
};

// ===== INICIALIZA O FIREBASE =====
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
console.log('✅ Firebase conectado!');


// ==========================================
// FUNÇÕES DE AUTENTICAÇÃO
// ==========================================

// 1. Verifica se o usuário já está logado ao carregar
document.addEventListener('DOMContentLoaded', function() {
    auth.onAuthStateChanged(function(usuario) {
        if (usuario) {
            // Usuário logado ✅
            const telaLogin = document.getElementById('telaLogin');
            const conteudoPrincipal = document.getElementById('conteudoPrincipal');
            const nomeUsuario = document.getElementById('nomeUsuarioLogado');
            
            if (telaLogin) telaLogin.style.display = 'none';
            if (conteudoPrincipal) conteudoPrincipal.style.display = 'block';
            if (nomeUsuario) nomeUsuario.textContent = usuario.email;
            
            console.log('✅ Usuário logado:', usuario.email);
        } else {
            // Usuário não logado ❌
            const telaLogin = document.getElementById('telaLogin');
            const conteudoPrincipal = document.getElementById('conteudoPrincipal');
            
            if (telaLogin) telaLogin.style.display = 'flex';
            if (conteudoPrincipal) conteudoPrincipal.style.display = 'none';
            
            console.log('🚪 Aguardando login...');
        }
    });
});

// 2. Função para fazer login
async function fazerLogin() {
    const emailInput = document.getElementById('emailLogin');
    const senhaInput = document.getElementById('senhaLogin');
    const erroEl = document.getElementById('erroLogin');
    
    if (!emailInput || !senhaInput) {
        console.error('❌ Campos de login não encontrados!');
        return;
    }
    
    const email = emailInput.value.trim();
    const senha = senhaInput.value.trim();
    
    if (!email || !senha) {
        if (erroEl) {
            erroEl.textContent = '⚠️ Preencha email e senha!';
            erroEl.style.display = 'block';
        }
        return;
    }
    
    try {
        await auth.signInWithEmailAndPassword(email, senha);
        if (erroEl) erroEl.style.display = 'none';
        console.log('✅ Login bem-sucedido!');
    } catch (error) {
        let mensagem = '⚠️ ';
        switch (error.code) {
            case 'auth/user-not-found': mensagem += 'Usuário não encontrado!'; break;
            case 'auth/wrong-password': mensagem += 'Senha incorreta!'; break;
            case 'auth/invalid-email': mensagem += 'Email inválido!'; break;
            case 'auth/too-many-requests': mensagem += 'Muitas tentativas. Tente mais tarde.'; break;
            case 'auth/network-request-failed': mensagem += 'Erro de conexão. Verifique sua internet.'; break;
            default: mensagem += error.message;
        }
        if (erroEl) {
            erroEl.textContent = mensagem;
            erroEl.style.display = 'block';
        }
        if (senhaInput) {
            senhaInput.value = '';
            senhaInput.focus();
        }
    }
}

// 3. Função para sair
async function fazerLogout() {
    if (!confirm('Deseja realmente sair do sistema?')) return;
    
    try {
        await auth.signOut();
        console.log('🚪 Logout realizado');
    } catch (error) {
        alert('Erro ao sair: ' + error.message);
    }
}

// 4. Permitir login com a tecla Enter
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const emailInput = document.getElementById('emailLogin');
        const senhaInput = document.getElementById('senhaLogin');
        
        // Verifica se o Enter foi pressionado dentro dos campos de login
        if (document.activeElement === emailInput || document.activeElement === senhaInput) {
            fazerLogin();
        }
    }
});

// ===== EXPORTA FUNÇÕES PARA USO GLOBAL =====
window.fazerLogin = fazerLogin;
window.fazerLogout = fazerLogout;
window.auth = auth;

console.log('✅ Módulo de autenticação carregado!');
// ==========================================
// FUNÇÕES DE CADASTRO
// ==========================================

// ===== FUNÇÃO PARA CADASTRO =====
async function fazerCadastro() {
    const email = document.getElementById('emailCadastro').value.trim();
    const senha = document.getElementById('senhaCadastro').value.trim();
    const confirmarSenha = document.getElementById('confirmarSenhaCadastro').value.trim();
    const erroEl = document.getElementById('erroCadastro');
    
    // Validações
    if (!email || !senha || !confirmarSenha) {
        erroEl.textContent = '⚠️ Preencha todos os campos!';
        erroEl.style.display = 'block';
        return;
    }
    
    if (senha.length < 6) {
        erroEl.textContent = '⚠️ A senha deve ter pelo menos 6 caracteres!';
        erroEl.style.display = 'block';
        return;
    }
    
    if (senha !== confirmarSenha) {
        erroEl.textContent = '⚠️ As senhas não coincidem!';
        erroEl.style.display = 'block';
        return;
    }
    
    try {
        // Tenta criar o usuário no Firebase
        const resultado = await auth.createUserWithEmailAndPassword(email, senha);
        erroEl.style.display = 'none';
        
        // Cadastro bem-sucedido!
        alert('✅ Conta criada com sucesso! Agora você pode fazer login.');
        
        // Volta para a tela de login
        mostrarLogin();
        
        console.log('✅ Usuário cadastrado:', email);
        
    } catch (error) {
        let mensagem = '⚠️ ';
        switch (error.code) {
            case 'auth/email-already-in-use':
                mensagem += 'Este email já está cadastrado!';
                break;
            case 'auth/invalid-email':
                mensagem += 'Email inválido!';
                break;
            case 'auth/weak-password':
                mensagem += 'Senha muito fraca. Use pelo menos 6 caracteres.';
                break;
            default:
                mensagem += error.message;
        }
        erroEl.textContent = mensagem;
        erroEl.style.display = 'block';
    }
}

// ===== FUNÇÕES PARA MOSTRAR/ESCONDER TELAS =====
function mostrarCadastro() {
    document.getElementById('telaLogin').style.display = 'none';
    document.getElementById('telaCadastro').style.display = 'flex';
    document.getElementById('erroCadastro').style.display = 'none';
}

function mostrarLogin() {
    document.getElementById('telaCadastro').style.display = 'none';
    document.getElementById('telaLogin').style.display = 'flex';
    document.getElementById('erroCadastro').style.display = 'none';
}

// ===== EXPORTA FUNÇÕES =====
window.fazerCadastro = fazerCadastro;
window.mostrarCadastro = mostrarCadastro;
window.mostrarLogin = mostrarLogin;

console.log('✅ Módulo de cadastro carregado!');
// ===== FUNÇÃO PARA ESQUECI A SENHA =====
async function esqueciSenha() {
    const email = prompt('📧 Digite seu email para receber o link de redefinição de senha:');
    
    if (!email) return; // Usuário cancelou
    
    // Validação simples
    if (!email.includes('@') || !email.includes('.')) {
        alert('⚠️ Por favor, digite um email válido.');
        return;
    }
    
    try {
        await auth.sendPasswordResetEmail(email);
        alert('✅ Email de redefinição enviado! Verifique sua caixa de entrada.');
        console.log('✅ Email de redefinição enviado para:', email);
    } catch (error) {
        let mensagem = '⚠️ ';
        switch (error.code) {
            case 'auth/user-not-found':
                mensagem += 'Usuário não encontrado. Verifique o email digitado.';
                break;
            case 'auth/invalid-email':
                mensagem += 'Email inválido.';
                break;
            default:
                mensagem += error.message;
        }
        alert(mensagem);
    }
}

// ===== EXPORTA A FUNÇÃO =====
window.esqueciSenha = esqueciSenha;