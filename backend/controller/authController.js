const Joi = require("joi");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const userDTO = require("../dto/user");
const JWTService = require("../services/JWTService");
const RefreshToken = require("../models/token");

const passswordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const authController = {
  async register(req, res, next) {
    //validation
    const userRegisterSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      name: Joi.string().max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(passswordPattern).required(),
      confirmPassword: Joi.ref("password"),
    });
    const { error } = userRegisterSchema.validate(req.body);
    //if error in validation -> return error vis middleware
    if (error) {
      return next(error);
    }
    // if email or username is already registered -> return error
    const { username, name, email, password } = req.body;

    try {
      const emailInUse = await User.exists({ email });
      const usernameInUse = await User.exists({ username });
      if (emailInUse) {
        const error = {
          status: 409,
          message: "Email already register use another email",
        };
        return next(error);
      }
      if (usernameInUse) {
        const error = {
          status: 409,
          message: "username not available, choose another username",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    //passsword hash
    const hashedPassword = await bcrypt.hash(password, 10);
    // user date stored in database

    let accessToken;
    let refreshToken;
    let user;
    try {
      const userToRegister = new User({
        username,
        email,
        name,
        password: hashedPassword,
      });
      user = await userToRegister.save();

      //token generation
      accessToken = JWTService.signAccessToken({ _id: user._id }, "30m");

      refreshToken = JWTService.signRefreshToken({ _id: user._id }, "60m");
    } catch (error) {
      return next(error);
    }
    //store refres token in db
    await JWTService.storeRefreshToken(refreshToken, user._id);

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    // response send
    const userDto = new userDTO(user);
    return res.status(201).json({ user: userDto, auth: true });
  },
  async login(req, res, next) {
    //match username and password
    const { username, password } = req.body;
    let user;
    try {
      //username match
      user = await User.findOne({ username });
      if (!user) {
        const error = {
          status: 401,
          message: "Invalid username or paassword",
        };
        return next(error);
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        const error = {
          status: 401,
          message: "Invalid password",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    const accessToken = JWTService.signAccessToken({ _id: user._id }, "30m");
    const refreshToken = JWTService.signRefreshToken({ _id: user._id }, "60m");

    //udpate refresh token in db
    try {
      await RefreshToken.updateOne(
        {
          _id: user._id,
        },
        { token: refreshToken },
        { upsert: true }
      );
    } catch (error) {
      return next(error);
    }

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    //return response
    const userDto = new userDTO(user);

    return res.status(200).json({ user: userDto, auth: true });
  },
  async logout(req, res, next) {
    //delete refresh token
    const { refreshToken } = req.cookies;
    try {
      await RefreshToken.deleteOne({ token: refreshToken });
    } catch (error) {
      return next(error);
    }
    //delete cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    //response send
    res.status(200).json({ user: null, auth: false });
  },
  async refresh(req, res, next) {
    // get refresh token from cookie
    const orignalRefreshToken = req.cookies.refreshToken;
    let id;
    try {
      id = JWTService.verifyRefreshToken(orignalRefreshToken)._id;
    } catch (e) {
      const error = {
        status: 401,
        message: "Unauhtorized",
      };
      return next(error);
    }
    //verify refresh token
    try {
      const match = RefreshToken.findOne({
        _id: id,
        token: orignalRefreshToken,
      });
      if (!match) {
        const error = {
          status: 401,
          message: "Unauthorized",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }
    //generate new tokens
    try {
      const accessToken = JWTService.signAccessToken({ _id: id }, "30m");
      const refreshToken = JWTService.signRefreshToken({ _id: id }, "60m");

      await RefreshToken.updateOne({ _id: id }, { token: refreshToken });
      res.cookie("accessToken", accessToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      });
      res.cookie("refreshToken", refreshToken, {
        maxAge: 1000 * 60 * 50 * 24,
        httpOnly: true,
      });
    } catch (error) {
      return next(error);
    }
    //update db, return response
    const user = await User.findOne({ _id: id });
    const userDto = new userDTO(user);
    return res.status(200).json({ user: userDto });
  },
};

module.exports = authController;
