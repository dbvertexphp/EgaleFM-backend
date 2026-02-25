import StoryCategory from '../../../models/admin/Category/category.model.js';
import slugify from 'slugify';

/**
 * Create Category
 */
export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const exists = await StoryCategory.findOne({ name });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists',
      });
    }

    const category = await StoryCategory.create({
      name,
      description,
      slug: slugify(name, { lower: true }),
      createdBy: req.admin._id,
      updatedBy: req.admin._id,
    });

    res.status(201).json({
      success: true,
      message: 'Story Category created successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Categories
 */
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await StoryCategory.find()
      .populate('createdBy', 'name')
      .populate('updatedBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Category By ID
 */
export const getCategoryById = async (req, res, next) => {
  try {
    const category = await StoryCategory.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('updatedBy', 'name');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Category
 */
export const updateCategory = async (req, res, next) => {
  try {
    const { name, description, status } = req.body;

    const category = await StoryCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    if (name) {
      category.name = name;
      category.slug = slugify(name, { lower: true });
    }

    if (description !== undefined) category.description = description;
    if (status) category.status = status;

    category.updatedBy = req.admin._id;

    await category.save();

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Category
 */
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await StoryCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    await StoryCategory.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Publish
 */
export const publishCategory = async (req, res, next) => {
  try {
    const category = await StoryCategory.findById(req.params.id);

    if (!category)
      return res.status(404).json({ success: false, message: 'Not found' });

    category.isPublished = true;
    category.updatedBy = req.admin._id;
    await category.save();

    res.json({
      success: true,
      message: 'Category published',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Unpublish
 */
export const unpublishCategory = async (req, res, next) => {
  try {
    const category = await StoryCategory.findById(req.params.id);

    if (!category)
      return res.status(404).json({ success: false, message: 'Not found' });

    category.isPublished = false;
    category.updatedBy = req.admin._id;
    await category.save();

    res.json({
      success: true,
      message: 'Category unpublished',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};
