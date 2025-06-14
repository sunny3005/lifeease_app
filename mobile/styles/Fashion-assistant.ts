// styles/fashionStyles.ts

import { StyleSheet } from 'react-native';

const fashionStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  header: {
    padding: 20,
    backgroundColor: '#f0fdfa',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderBottomWidth: 1,
    borderColor: '#cbd5e1',
    elevation: 3,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 18,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 3,
  },
  refreshButton: {
    backgroundColor: '#e5e7eb',
    borderRadius: 20,
  },
  tabsContainer: {
    marginTop: 14,
  },
  tabsContent: {
    gap: 10,
    paddingHorizontal: 16,
  },
  categoryTab: {
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryTabLabel: {
    fontWeight: 'bold',
  },
  addCategoryButton: {
    borderRadius: 20,
    borderColor: '#202020',
  },
  addCategoryLabel: {
    color: '#e0761f',
  },
  addCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryInput: {
    width: 120,
    backgroundColor: '#fff',
    height: 44,
  },
  addButton: {
    height: 44,
    borderRadius: 10,
    backgroundColor: '#e0761f',
  },
  addButtonLabel: {
    color: '#fff',
  },
  cancelButton: {
    backgroundColor: '#f8fafc',
    borderRadius: 50,
  },
  uploadButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    gap: 10,
  },
  cameraButton: {
    flex: 1,
    backgroundColor: '#c25d0a',
    borderRadius: 12,
  },
  galleryButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#c25d0a',
  },
  buttonLabel1: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonLabel2: {
    color: '#c25d0a',
    fontWeight: 'bold',
  },
  urlInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
    gap: 10,
  },
  urlInput: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
  },
  urlAddButton: {
    backgroundColor: '#e0761f',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  urlAddButtonLabel: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
    fontStyle: 'italic',
  },
  outfitsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  outfitContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 16,
  },
  cardImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  donateButton: {
    flex: 1,
    marginRight: 8,
  },
  donateButtonLabel: {
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
    borderRadius: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#64748b',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
  },
  botIcon: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    zIndex: 99,
    borderRadius: 50,
    elevation: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  closeBotIcon: {
    backgroundColor: '#f87171',
    padding: 15,
    borderRadius: 30,
  },
  closeBotText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  chatBoxRight: {
    position: 'absolute',
    top: 100,
    bottom: 100,
    right: 0,
    width: '80%',
    backgroundColor: '#f8fafc',
    padding: 20,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    elevation: 8,
    zIndex: 99,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1e293b',
  },
  chatSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
  },
  mainMenuButton: {
    marginBottom: 12,
    backgroundColor: '#0284c7',
    borderRadius: 12,
  },
  mainMenuButtonLabel: {
    color: 'white',
    fontWeight: 'bold',
  },
  chatMenuContent: {
    gap: 10,
    paddingBottom: 30,
  },
  chatCategoryButton: {
    borderRadius: 12,
    borderWidth: 1,
  },
  chatCategoryButtonLabel: {
    fontWeight: 'bold',
  },
});

export default fashionStyles;
