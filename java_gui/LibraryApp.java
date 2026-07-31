import javax.swing.*;
import java.awt.*;

public class LibraryApp {
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new LibraryApp().createAndShowGUI());
    }

    private void createAndShowGUI() {
        JFrame frame = new JFrame("🏛 College Library Management System");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(900, 600);
        frame.setLayout(new BorderLayout());

        // Header
        JPanel headerPanel = new JPanel();
        headerPanel.setBackground(new Color(41, 128, 185));
        JLabel headerLabel = new JLabel("Welcome to College Library", SwingConstants.CENTER);
        headerLabel.setForeground(Color.WHITE);
        headerLabel.setFont(new Font("Arial", Font.BOLD, 24));
        headerPanel.add(headerLabel);
        frame.add(headerPanel, BorderLayout.NORTH);

        // Sidebar (Navigation)
        JPanel sidebarPanel = new JPanel();
        sidebarPanel.setLayout(new GridLayout(7, 1, 10, 10));
        sidebarPanel.setBackground(new Color(44, 62, 80));
        sidebarPanel.setPreferredSize(new Dimension(200, 0));

        String[] tabs = {"Dashboard", "Books", "Students", "Issue Book", "Return Book", "History", "About"};
        for (String tab : tabs) {
            JButton btn = new JButton(tab);
            btn.setBackground(new Color(52, 73, 94));
            btn.setForeground(Color.WHITE);
            btn.setFocusPainted(false);
            btn.setFont(new Font("Arial", Font.BOLD, 14));
            sidebarPanel.add(btn);
        }
        frame.add(sidebarPanel, BorderLayout.WEST);

        // Main Content Area (Tabbed Pane simulation)
        JTabbedPane tabbedPane = new JTabbedPane();
        tabbedPane.addTab("Dashboard", createDashboardPanel());
        tabbedPane.addTab("Books", createBooksPanel());
        tabbedPane.addTab("Students", new JPanel()); // Placeholder
        frame.add(tabbedPane, BorderLayout.CENTER);

        // Footer
        JPanel footerPanel = new JPanel();
        footerPanel.setBackground(Color.DARK_GRAY);
        JLabel footerLabel = new JLabel("Designed & Developed by Jaweria Shakeel", SwingConstants.CENTER);
        footerLabel.setForeground(Color.LIGHT_GRAY);
        footerPanel.add(footerLabel);
        frame.add(footerPanel, BorderLayout.SOUTH);

        frame.setLocationRelativeTo(null);
        frame.setVisible(true);
    }

    private JPanel createDashboardPanel() {
        JPanel panel = new JPanel(new GridBagLayout());
        panel.setBackground(Color.WHITE);
        JLabel label = new JLabel("Dashboard Overview");
        label.setFont(new Font("Arial", Font.BOLD, 20));
        panel.add(label);
        return panel;
    }

    private JPanel createBooksPanel() {
        JPanel panel = new JPanel(new BorderLayout());
        String[] columns = {"Book ID", "Book Name", "Author", "Department", "Status"};
        String[][] data = {
            {"B001", "C++ Programming", "Bjarne Stroustrup", "CS", "Available"},
            {"B002", "Data Structures", "Mark Allen Weiss", "IT", "Issued"}
        };
        JTable table = new JTable(data, columns);
        panel.add(new JScrollPane(table), BorderLayout.CENTER);
        
        JPanel bottomPanel = new JPanel();
        bottomPanel.add(new JButton("Add Book"));
        bottomPanel.add(new JButton("Update Book"));
        bottomPanel.add(new JButton("Delete Book"));
        panel.add(bottomPanel, BorderLayout.SOUTH);
        
        return panel;
    }
}
