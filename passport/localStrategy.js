const Localstrategy = require('passport-local');
const { User } = require('../models');
const bcrypt = require('bcrypt');

module.exports = (passport) => {
    passport.use(
        new Localstrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
            },
            async (email, password, done) => {
                try {
                    // 유저 email 있는지?
                    const isuser = await User.findOne({ where: { email } });
                    if (isuser) {
                        // 비번 검사
                        const cmp_password = bcrypt.compare(password, isuser.password);
                        if (cmp_password) {
                            console.log('로그인을 성공 했습니다!');
                            done(null, isuser);
                        } else {
                            // 이메일은 맞았으나 비밀번호가 틀릴 때

                            done(null, false, { message: '아이디 및 비밀번호가 일치하지 않습니다.' });
                        }
                    } else {
                        // 이메일이 틀릴 때
                        done(null, false, { message: '아이디 및 비밀번호가 일치하지 않습니다' });
                    }
                } catch (err) {
                    console.error(err);
                    done(err);
                }
            }
        )
    );
};
