class Matrix
{
    constructor(rows, cols)    // constructs a matrix of size row x cols
    {
        this.rows = rows;
        this.cols = cols;

        this.a = new Array(rows);    // creates an array and resizes it's length to rows
        for (let i = 0; i < rows; i++)
        {
            this.a[i] = new Array(cols).fill(0);    //    resizes array with num of columns and fills with 0
        }
    }

    // Return the element at row i, column j
    get(i , j)
    {
        return this.a[i][j];
    }

    // Assign the element at row i, column j
    set(i, j, value)
    {
        this.a[i][j] = value;
    }

    getRows() { return this.rows; }
    getCols() { return this.cols; }

    // Methods
    // This method adds two Matrices of exact dimensions together and returns the resulting Matrix.
    add(other)
    {
        if (this.getRows() != other.getRows() || this.getCols() != other.getCols()) // check for valid dimensions
        {
            throw new Error("Error: dimensions must agree");
        }

        let result = new Matrix(this.getRows(), this.getCols()); // construct the result matrix

        for (let i = 0; i < this.getRows(); i++)
        {
            for (let j = 0; j < this.getCols(); j++)
            {
                result.a[i][j] = this.a[i][j] + other.a[i][j]; // ex: c(i, j) = a(i, j) + b(i, j)
            }
        }
        return result;
    }

    // This method multiplies two Matrices with valid dimensions together and returns the resulting Matrix.
    multiply(other)
    {
        if (this.getCols() != other.getRows())    // for multiplication: matrix a.cols must = matrix b.rows
        {
            throw new Error("Error: dimensions must agree");
        }

        let result = new Matrix(this.getRows(), other.getCols());

        // Use triple for loop (i, j, k) for equation: C[i][j] += A[i][k] * B[k][j]
        // i = rows of A; j = cols of B; k = cols of A / rows of B
        for (let i = 0; i < this.getRows(); i++)
        {
            for (let j = 0; j < other.getCols(); j++)
            {
                for (let k = 0; k < this.getCols(); k++)
                {
                    result.a[i][j] += this.a[i][k] * other.a[k][j];
                }
            }
        }
        return result;
    }

    equals(other)
    {
        if (this.getRows() != other.getRows() || this.getCols() != other.getCols())
        {
            return false;
        }

        for (let i = 0; i < this.getRows(); i++)
        {
            for (let j = 0; j < other.getCols(); j++)
            {
                if (Math.abs(this.get(i, j) - other.get(i, j)) > 0.001) // compares difference of matrix a[i][j] and b[i][j] to an arbitrary threshold
                {
                    return false;    // if the difference is > threshold, then determine them to be !=
                }
            }
        }
        return true;
    }

    notEquals(other)
    {
        return !(this.equals(other));
    }

    toString()
    {
        let s = "";
        for (let i = 0; i < this.getRows(); i++)
        {
            for (let j = 0; j < this.getCols(); j++)
            {
                // C++ version: os << setw(10) << a(i, j) << " "; 
                s += this.get(i, j).toString().padStart(10, " ") + " ";
            }
            s += "\n";
        }
        return s;
    }
}

//    +===================================+
//    |        MATRIX CONSTRUCTORS            |    
//    +===================================+

///    2D rotation matrix
///    usage:  A = R * A rotates A theta radians counter-clockwise
class RotationMatrix extends Matrix
{
    constructor(theta)
    {
        super(2, 2);    // call parent constructor to make 2x2 matrix
        this.set(0, 0, Math.cos(theta));     // (0,0) -> cos(theta)
        this.set(0, 1, -Math.sin(theta));   // (0,1) -> -sin(theta)
        this.set(1, 0, Math.sin(theta));   // (1,0) -> sin(theta)
        this.set(1, 1, Math.cos(theta));  // (1,1) -> cos(theta)
    }
}

///    2D scaling matrix
///    usage:  A = S * A expands or contracts A by the specified scaling factor
class ScalingMatrix extends Matrix
{
    constructor(scale)
    {
        super(2, 2);    // call parent constructor to make 2x2 matrix

        // Hardcode scalar values in 2x2 matrix
        this.set(0, 0, scale);    
        this.set(1, 1, scale);
    }
}

/// 2D translation matrix
/// usage:  A = T + A will shift all coordinates of A by (xShift, yShift)
class TranslationMatrix extends Matrix
{
    constructor(xShift, yShift, nCols)
    {
        super(2, nCols);    // call parent constructor to make a 2xn matrix

        for (let i = 0; i < 2; i++)
        {
            for (let j = 0; j < nCols; j++)
            {
                this.set(i, j, (i === 0) ? xShift : yShift);    // harcode x and y to row 0 and 1 
            }
        }
    }
}

export { Matrix, RotationMatrix, ScalingMatrix, TranslationMatrix };