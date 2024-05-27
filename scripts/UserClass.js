class User {

    static id = 0;

    constructor(email, password){
        this.id = User.id++;
        this.email = email;

        this.password = password;
    }
}

export default User