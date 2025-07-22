CREATE TABLE student_loan_planner (
    id SERIAL PRIMARY KEY,
    
    -- User Input Fields
    user_type VARCHAR(50),               -- e.g., Student
    loan_amount NUMERIC(12, 2) NOT NULL, -- Principal loan amount in ₹
    interest_rate NUMERIC(5, 2) NOT NULL, -- Annual interest rate in %
    loan_term_years INTEGER NOT NULL,     -- Loan term in years
    moratorium_period INTEGER DEFAULT 0,  -- Months of no EMI after loan (optional)
    monthly_income NUMERIC(10, 2),        -- Optional income during/after studies
    repayment_start_date DATE,            -- When EMI starts (optional)

    -- Calculated Output Fields
    emi_amount NUMERIC(10, 2),            -- Monthly EMI
    total_interest NUMERIC(12, 2),        -- Total interest paid over loan term
    total_repayment NUMERIC(12, 2),       -- Principal + Interest
    repayment_end_date DATE,              -- EMI end date (if repayment_start_date provided)
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better query performance
CREATE INDEX idx_student_loan_user_type ON student_loan_planner(user_type);
CREATE INDEX idx_student_loan_created_at ON student_loan_planner(created_at);

-- Sample insert for testing
INSERT INTO student_loan_planner (
    user_type, loan_amount, interest_rate, loan_term_years, 
    moratorium_period, monthly_income, repayment_start_date,
    emi_amount, total_interest, total_repayment, repayment_end_date
) VALUES (
    'Student', 500000.00, 10.50, 10, 
    6, 50000.00, '2024-06-01',
    6607.00, 292840.00, 792840.00, '2034-06-01'
);
